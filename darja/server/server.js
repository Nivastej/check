const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(express.static("public"));

io.on("connection", socket => {
    socket.on("join-room", roomId => {
        socket.join(roomId);
        socket.to(roomId).emit("user-joined");

        // Watch sync
        socket.on("sync-play", time => {
            socket.to(roomId).emit("sync-play", time);
        });

        socket.on("sync-pause", () => {
            socket.to(roomId).emit("sync-pause");
        });

        // WebRTC signaling
        socket.on("offer", data => {
            socket.to(roomId).emit("offer", data);
        });

        socket.on("answer", data => {
            socket.to(roomId).emit("answer", data);
        });

        socket.on("ice-candidate", data => {
            socket.to(roomId).emit("ice-candidate", data);
        });
    });
});

server.listen(3000, () =>
    console.log("Server running on http://localhost:3000")
);