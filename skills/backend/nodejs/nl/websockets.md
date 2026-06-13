# WebSockets and Socket.io

## Wanneer activeren
- Bouwen van real-time bidirectional features (chat, live dashboards, notifications, multiplayer)
- Instellen van Socket.io server met authentication middleware
- Beheren van rooms en namespaces voor channel-based messaging
- Scaling Socket.io horizontaal met Redis adapter
- Implementeren van client-side reconnection logic
- Transmitting binary data over WebSocket

## Wanneer NIET gebruiken
- One-directional streaming van server naar client alleen — gebruik Server-Sent Events (SSE) in plaats
- Eenvoudige request/response patronen waarbij HTTP polling acceptable is en latency niet critical
- Wanneer transport layer al handled door managed service (Pusher, Ably, etc.) en je alleen client SDK nodig hebt

## Instructies

### Socket.io Server Setup with Auth Middleware

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

Rooms zijn server-side namespaces. Socket kan in multiple rooms. Rooms persist niet — gecreëerd op first join en vernietigd wanneer empty.

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

Broadcast targets:
```typescript
io.emit("event", data);                  // all connected sockets
io.to("room-id").emit("event", data);    // all sockets in a room
socket.to("room-id").emit("event", data); // room members excluding sender
socket.broadcast.emit("event", data);    // all sockets except sender
socket.emit("event", data);              // sender only
io.except("room-id").emit("event", data); // all except those in room
```

### Redis Adapter for Horizontal Scaling

Zonder Redis, events emit op één server process zijn niet ontvangen door sockets connected aan ander process.

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

Met Redis adapter, Socket.io serializes events door Redis pub/sub. Alle server instances delen room membership.

### Client Reconnection with Exponential Backoff

Socket.io client handelt reconnection automatisch. Configureer expliciet:

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
  });

  return socket;
}
```

---
