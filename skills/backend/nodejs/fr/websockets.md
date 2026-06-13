# WebSockets et Socket.io

## Quand activer
- Construction de fonctionnalités bidirectionnelles temps réel (chat, tableaux de bord en direct, notifications, multijoueur)
- Configuration du serveur Socket.io avec middleware d'authentification
- Gestion des rooms et namespaces pour la messagerie basée sur les canaux
- Mise à l'échelle de Socket.io horizontalement avec un adaptateur Redis
- Implémentation de la logique de reconnexion côté client
- Transmission de données binaires sur WebSocket

## Quand ne PAS utiliser
- Streaming unidirectionnel du serveur au client uniquement — utiliser Server-Sent Events (SSE) à la place
- Les modèles simples requête/réponse où le polling HTTP est acceptable et la latence n'est pas critique
- Quand la couche de transport est déjà gérée par un service géré (Pusher, Ably, etc.) et vous n'avez besoin que du SDK client

## Instructions

### Configuration du serveur Socket.io avec middleware d'authentification

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

### Gestion des rooms — Rejoindre, quitter, diffuser

Les rooms sont des espaces de noms côté serveur. Un socket peut être dans plusieurs rooms. Les rooms ne persistent pas — elles sont créées à la première adhésion et détruites quand elles sont vides.

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

Cibles de diffusion :

```typescript
io.emit("event", data);                  // all connected sockets
io.to("room-id").emit("event", data);    // all sockets in a room
socket.to("room-id").emit("event", data); // room members excluding sender
socket.broadcast.emit("event", data);    // all sockets except sender
socket.emit("event", data);              // sender only
io.except("room-id").emit("event", data); // all except those in room
```

### Adaptateur Redis pour la mise à l'échelle horizontale

Sans Redis, les événements émis sur un processus serveur ne sont pas reçus par les sockets connectés à un autre processus.

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

Avec l'adaptateur Redis, Socket.io sérialise les événements via Redis pub/sub. Toutes les instances serveur partagent l'adhésion à la room. Pour les recherches d'état de room sur les instances, utiliser `io.in("room").fetchSockets()` (async).

Considérations supplémentaires :
- Utiliser un équilibrage de charge par session collante (par ex. NGINX `ip_hash`, AWS ALB `stickiness`) quand `polling` est activé — le polling nécessite que toutes les demandes d'un client frappent le même serveur pendant la phase d'établissement de liaison
- Si vous utilisez seulement le transport WebSocket (`transports: ["websocket"]`), les sessions collantes ne sont pas requises

### Reconnexion client avec backoff exponentiel

Le client Socket.io gère la reconnexion automatiquement. Le configurer explicitement :

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

Rejoindre les rooms après la reconnexion puisque l'adhésion à la room est stockée en mémoire par processus serveur :

```typescript
function rejoinRooms() {
  const rooms = getRoomStateFromLocalStorage();
  rooms.forEach((roomId) => socket.emit("chat:join", roomId));
}
```

### Conventions de nommage d'événements

Le nommage cohérent d'événements empêche les conflits et aide au débogage. Utiliser le format `namespace:action` :

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

Éviter les noms génériques comme `data`, `update`, `event`. Toujours utiliser les minuscules et les traits de soulignement dans le segment action.

Définir les types d'événements dans un module partagé :

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

### Données binaires sur WebSocket

Socket.io supporte l'envoi de données binaires (Buffer, ArrayBuffer, Blob, TypedArray) nativement :

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

Pour les transferts de fichiers volumineux, fragmenter les données manuellement et réassembler chez le récepteur. Ne pas envoyer de fichiers plus grands que quelques Mo en tant qu'événements uniques — cela sature la boucle d'événements.

## Exemple

Un système de présence et de messagerie temps réel :

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
