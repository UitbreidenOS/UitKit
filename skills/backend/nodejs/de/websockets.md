# WebSockets und Socket.io

## Wann aktivieren
- Aufbau von Echtzeit-Bidirektional-Features (Chat, Live Dashboards, Benachrichtigungen, Multiplayer)
- Setup von Socket.io Server mit Authentication Middleware
- Verwaltung von Rooms und Namespaces für Channel-basiertes Messaging
- Skalierung von Socket.io horizontal mit Redis Adapter
- Implementierung von Client-Side Reconnection Logic
- Übertragung von Binärdaten über WebSocket

## Wann NICHT verwenden
- One-Directional Streaming von Server zu Client nur — verwenden Sie Server-Sent Events (SSE) stattdessen
- Einfache Request/Response Muster, wo HTTP Polling akzeptabel ist und Latenz nicht kritisch ist
- Wenn die Transport Layer bereits von einem verwalteten Service (Pusher, Ably, etc.) behandelt wird und Sie nur das Client SDK benötigen

## Anweisungen

### Socket.io Server Setup mit Auth Middleware

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

### Room Management — Join, Leave, Broadcast

Rooms sind Server-seitige Namespaces. Ein Socket kann in mehreren Rooms sein. Rooms sind nicht persistent — sie werden beim ersten Join erstellt und zerstört, wenn leer.

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

Broadcast Targets:

```typescript
io.emit("event", data);                  // all connected sockets
io.to("room-id").emit("event", data);    // all sockets in a room
socket.to("room-id").emit("event", data); // room members excluding sender
socket.broadcast.emit("event", data);    // all sockets except sender
socket.emit("event", data);              // sender only
io.except("room-id").emit("event", data); // all except those in room
```

### Redis Adapter für Horizontal Scaling

Ohne Redis werden Events, die auf einem Server-Prozess emittiert werden, nicht von Sockets empfangen, die mit einem anderen Prozess verbunden sind.

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

Mit dem Redis Adapter serialisiert Socket.io Events über Redis Pub/Sub. Alle Server-Instanzen teilen Room-Membership. Für Room-Status-Lookups über Instanzen verwenden Sie `io.in("room").fetchSockets()` (async).

Zusätzliche Überlegungen:
- Verwenden Sie einen Sticky-Session Load Balancer (z.B. NGINX `ip_hash`, AWS ALB `stickiness`), wenn `polling` aktiviert ist — Polling erfordert, dass alle Anfragen von einem Client während der Handshake-Phase denselben Server treffen
- Falls nur WebSocket-Transport (`transports: ["websocket"]`) verwendet wird, sind Sticky Sessions nicht erforderlich

### Client Reconnection mit Exponential Backoff

Socket.io Client handhabt Reconnection automatisch. Konfigurieren Sie es explizit:

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

Re-join Rooms nach Reconnect, da Room-Membership im Memory pro Server-Prozess gespeichert wird:

```typescript
function rejoinRooms() {
  const rooms = getRoomStateFromLocalStorage();
  rooms.forEach((roomId) => socket.emit("chat:join", roomId));
}
```

### Event Naming Conventions

Konsistente Event-Namensgebung verhindert Konflikte und unterstützt Debugging. Verwenden Sie `namespace:action` Format:

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

Vermeiden Sie generische Namen wie `data`, `update`, `event`. Verwenden Sie immer Kleinbuchstaben und Unterstriche im Action-Segment.

Definieren Sie Event-Typen in einem gemeinsamen Modul:

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

### Binärdaten über WebSocket

Socket.io unterstützt das native Senden von Binärdaten (Buffer, ArrayBuffer, Blob, TypedArray):

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

Für große Datei-Transfers chunken Sie die Daten manuell und reassemblieren auf dem Empfänger. Senden Sie nicht mehrere MB große Dateien als einzelne Events — das sättigt die Event Loop.

## Beispiel

Ein Echtzeit-Präsenz- und Messaging-System:

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
