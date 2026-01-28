const socket = io();
const roomId = location.hash.substring(1) || Math.random().toString(36).slice(2);
document.getElementById("room").innerText = roomId;
location.hash = roomId;

socket.emit("join-room", roomId);

const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
    });

pc.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
};

pc.onicecandidate = e => {
    if (e.candidate) socket.emit("ice-candidate", e.candidate);
};

socket.on("user-joined", async() => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", offer);
});

socket.on("offer", async offer => {
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", answer);
});

socket.on("answer", answer => {
    pc.setRemoteDescription(answer);
});

socket.on("ice-candidate", c => {
    pc.addIceCandidate(c);
});