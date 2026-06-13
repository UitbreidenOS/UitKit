# WebSockets y Socket.io

## Cuándo activar
- Construcción de características bidireccionales en tiempo real (chat, dashboards en vivo, notificaciones, multijugador)
- Configuración de servidor Socket.io con middleware de autenticación
- Gestión de salas y espacios de nombres para mensajería basada en canales
- Escalado horizontal de Socket.io con adaptador Redis
- Implementación de lógica de reconexión del lado del cliente
- Transmisión de datos binarios sobre WebSocket

## Cuándo NO usar
- Streaming unidireccional solo de servidor a cliente — usar Server-Sent Events (SSE) en su lugar
- Patrones simples de solicitud/respuesta donde el sondeo HTTP es aceptable y la latencia no es crítica
- Cuando la capa de transporte ya está manejada por un servicio administrado (Pusher, Ably, etc.) y solo necesitas el SDK del cliente

## Instrucciones

### Configuración del Servidor Socket.io con Middleware de Autenticación

```typescript
// server/socket.ts
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { verify } from "jsonwebtoken";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 20000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],   // websocket first, polling fallback
});

// Authentication middleware — runs before the connection event
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ??
      socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!token) return next(new Error("Authentication required"));

    const payload = verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    socket.data.userId = payload.userId;
    socket.data.role   = payload.role;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket: Socket) => {
  const { userId, role } = socket.data;
  console.log(`[socket] connected: ${socket.id} user=${userId}`);

  socket.on("disconnect", (reason) => {
    console.log(`[socket] disconnected: ${socket.id} reason=${reason}`);
  });

  registerChatHandlers(io, socket);
  registerPresenceHandlers(io, socket);
});

export { io, httpServer };
```

### Gestión de Salas — Unirse, Abandonar, Difundir

Las salas son espacios de nombres del lado del servidor. Un socket puede estar en múltiples salas. Las salas no persisten — se crean en el primer join y se destruyen cuando están vacías.

```typescript
// handlers/chat.ts
export function registerChatHandlers(io: Server, socket: Socket) {
  // Join a room
  socket.on("chat:join", async (roomId: string) => {
    await socket.join(roomId);

    // Notify others in the room
    socket.to(roomId).emit("chat:user_joined", {
      userId: socket.data.userId,
      roomId,
    });

    // Acknowledge to sender
    socket.emit("chat:joined", { roomId, success: true });
  });

  // Send a message to a room
  socket.on("chat:message", async (payload: { roomId: string; text: string }) => {
    const { roomId, text } = payload;

    // Guard: socket must be in the room
    if (!socket.rooms.has(roomId)) {
      socket.emit("chat:error", { message: "Not in this room" });
      return;
    }

    const message = await saveMessage({ userId: socket.data.userId, roomId, text });

    // Broadcast to all sockets in the room INCLUDING sender
    io.to(roomId).emit("chat:message", message);

    // OR exclude sender:
    // socket.to(roomId).emit("chat:message", message);
  });

  // Leave a room
  socket.on("chat:leave", (roomId: string) => {
    socket.leave(roomId);
    socket.to(roomId).emit("chat:user_left", { userId: socket.data.userId });
  });

  // On disconnect, Socket.io auto-removes from all rooms
  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("chat:user_left", { userId: socket.data.userId });
      }
    }
  });
}
```

Objetivos de difusión:

```typescript
io.emit("event", data);                  // all connected sockets
io.to("room-id").emit("event", data);    // all sockets in a room
socket.to("room-id").emit("event", data); // room members excluding sender
socket.broadcast.emit("event", data);    // all sockets except sender
socket.emit("event", data);              // sender only
io.except("room-id").emit("event", data); // all except those in room
```

### Adaptador Redis para Escalado Horizontal

Sin Redis, los eventos emitidos en un proceso de servidor no son recibidos por sockets conectados a otro proceso.

```bash
npm install @socket.io/redis-adapter ioredis
```

```typescript
// server/socket.ts
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "ioredis";

const pubClient = createClient({ host: process.env.REDIS_HOST, port: 6379 });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));

// After adding the adapter, io.to("room").emit() works across all server instances
```

Con el adaptador Redis, Socket.io serializa eventos a través de Redis pub/sub. Todas las instancias de servidor comparten membresía de sala. Para búsquedas de estado de sala en instancias usa `io.in("room").fetchSockets()` (async).

Consideraciones adicionales:
- Usar balanceador de carga de sesión pegajosa (ej., NGINX `ip_hash`, AWS ALB `stickiness`) cuando `polling` está habilitado — el sondeo requiere que todas las solicitudes de un cliente golpeen el mismo servidor durante la fase de apretón de manos
- Si solo se usa transporte WebSocket (`transports: ["websocket"]`), las sesiones pegajosas no son requeridas

### Reconexión del Cliente con Retroceso Exponencial

Socket.io client maneja reconexión automáticamente. Configurarlo explícitamente:

```typescript
// client/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export function createSocket(token: string): Socket {
  socket = io(process.env.NEXT_PUBLIC_API_URL!, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,          // initial delay ms
    reconnectionDelayMax: 30000,      // cap at 30s
    randomizationFactor: 0.5,         // jitter ±50%
    timeout: 10000,
  });

  socket.on("connect", () => {
    console.log("[socket] connected:", socket.id);
    // Re-join rooms after reconnect
    rejoinRooms();
  });

  socket.on("connect_error", (err) => {
    if (err.message === "Invalid token") {
      socket.disconnect();
      redirectToLogin();
    }
    console.error("[socket] connect error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.warn("[socket] disconnected:", reason);
    if (reason === "io server disconnect") {
      // Server forcibly disconnected — manual reconnect
      socket.connect();
    }
    // Other reasons: client will auto-reconnect
  });

  return socket;
}
```

Reunirse a salas después de reconectar ya que la membresía de sala se almacena en memoria por proceso de servidor:

```typescript
function rejoinRooms() {
  const rooms = getRoomStateFromLocalStorage();
  rooms.forEach((roomId) => socket.emit("chat:join", roomId));
}
```

### Convenciones de Denominación de Eventos

La denominación consistente de eventos previene conflictos y ayuda a depurar. Usar formato `namespace:action`:

```
chat:message
chat:join
chat:leave
chat:typing_start
chat:typing_stop
presence:online
presence:offline
notification:new
room:created
room:deleted
error                 # reserved by Socket.io — use sparingly
```

Evitar nombres genéricos como `data`, `update`, `event`. Siempre usar minúsculas y guiones bajos dentro del segmento de acción.

Definir tipos de evento en un módulo compartido:

```typescript
// shared/socket-events.ts
export interface ServerToClientEvents {
  "chat:message": (msg: ChatMessage) => void;
  "chat:user_joined": (info: { userId: string; roomId: string }) => void;
  "presence:online": (userId: string) => void;
  "notification:new": (notif: Notification) => void;
}

export interface ClientToServerEvents {
  "chat:join": (roomId: string, callback: (success: boolean) => void) => void;
  "chat:message": (payload: { roomId: string; text: string }) => void;
  "chat:leave": (roomId: string) => void;
}

// Typed server
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

// Typed client
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("...");
```

### Datos Binarios sobre WebSocket

Socket.io soporta envío de datos binarios (Buffer, ArrayBuffer, Blob, TypedArray) nativamente:

```typescript
// Server — send a file buffer
socket.on("file:request", async (fileId: string) => {
  const buffer: Buffer = await readFile(fileId);
  socket.emit("file:data", { id: fileId, buffer });
});

// Client — receive and use binary
socket.on("file:data", ({ id, buffer }: { id: string; buffer: ArrayBuffer }) => {
  const blob = new Blob([buffer]);
  const url  = URL.createObjectURL(blob);
  downloadLink.href = url;
});

// Client — send binary (e.g., audio chunk)
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) socket.emit("audio:chunk", e.data);
  };
  recorder.start(100);  // 100ms chunks
});
```

Para transferencias de archivos grandes, dividir los datos manualmente y reensamblarse en el receptor. No enviar archivos mayores que unos pocos MB como eventos únicos — saturar el bucle de eventos.

## Ejemplo

Un sistema de presencia y mensajería en tiempo real:

```typescript
// server — presence handler
export function registerPresenceHandlers(io: Server, socket: Socket) {
  socket.on("presence:ping", (roomId: string) => {
    socket.to(roomId).emit("presence:online", socket.data.userId);
  });

  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        io.to(room).emit("presence:offline", socket.data.userId);
      }
    }
  });
}

// client React hook
function useSocket(roomId: string) {
  const [online, setOnline] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.emit("chat:join", roomId);
    socket.emit("presence:ping", roomId);

    socket.on("chat:message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("presence:online",  (id) => setOnline((prev) => [...new Set([...prev, id])]));
    socket.on("presence:offline", (id) => setOnline((prev) => prev.filter((u) => u !== id)));

    return () => {
      socket.emit("chat:leave", roomId);
      socket.off("chat:message");
      socket.off("presence:online");
      socket.off("presence:offline");
    };
  }, [roomId]);

  const send = (text: string) => socket.emit("chat:message", { roomId, text });

  return { online, messages, send };
}
```

---
