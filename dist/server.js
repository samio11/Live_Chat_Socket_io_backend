"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = (0, http_1.createServer)(app);
// Initialize Socket.IO
const io = new socket_io_1.Server(httpServer, {
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
