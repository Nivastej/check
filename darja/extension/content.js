const socket = io("http://localhost:3000");

const video = document.querySelector("video");

if (video) {
    video.onplay = () => socket.emit("sync-play", video.currentTime);
    video.onpause = () => socket.emit("sync-pause");

    socket.on("sync-play", time => {
        video.currentTime = time;
        video.play();
    });

    socket.on("sync-pause", () => video.pause());
}