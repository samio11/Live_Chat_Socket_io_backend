import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`🔗 User connected: ${socket.id}`);

  // Listen for messages from client
  socket.on("sendMessage", (data) => {
    console.log("📩 Message received:", data);
    // Broadcast to all connected clients
    io.emit("newMessage", data);
  });

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    io.emit("userDisconnected", {
      user: socket.id,
      message: "A user has left the chat",
    });
  });
});
httpServer.listen(5000, () => {
  console.log("🚀 Chat server running on http://localhost:5000");
});
