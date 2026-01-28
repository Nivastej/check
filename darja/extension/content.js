importScripts("https://cdn.socket.io/4.7.5/socket.io.min.js");

const socket = io("https://YOUR-APP.onrender.com");

const video = document.querySelector("video");
if (!video) return;

video.addEventListener("play", () => {
  socket.emit("sync-play", video.currentTime);
});

video.addEventListener("pause", () => {
  socket.emit("sync-pause");
});

socket.on("sync-play", time => {
  video.currentTime = time;
  video.play();
});

socket.on("sync-pause", () => {
  video.pause();
});

