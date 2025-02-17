
const {Server}=require("socket.io");  
const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your Next.js app's URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Listen for new messages
  socket.on("sendMessage", async (data) => {
    const { userId, content } = data;

    // Save the message to the database using Prism

    // Broadcast the message to all connected clients
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = 5000; // Run the Socket.IO server on port 3001
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});