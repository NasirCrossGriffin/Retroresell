// socket.js
import { io } from "socket.io-client";

const socket = process.env.NODE_ENV === "development" ? io(process.env.REACT_APP_REQ_URL) : io({
    reconnectionAttempts: 5, // Limit to 5 retries
    transports: ["websocket", "polling"], // Ensure compatibility
});

// Listen for events
socket.on("broadcast", (data) => {
    console.log("Broadcast message:", data);
});

// Emit an event
socket.emit("message", { text: "Hello, Server!" });


export default socket;