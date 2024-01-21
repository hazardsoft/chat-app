import { io } from 'socket.io-client';

const socket = io();
socket.on("connect", () => {
    console.log(`Client connected to the server`);
});
socket.on("disconnect", () => {
    console.log(`Client disconnected from the server`);
});
socket.on("message", (message) => {
    console.log(`Message received from the server: ${message}`);
});
const submitForm = (event) => {
    event.preventDefault();
    const form = event.target;
    const input = form.elements.namedItem("message");
    const message = input.value;
    console.log(`Message (${message}) sent!`);
    socket.emit("message", message);
};
const form = document.getElementById("messageForm");
form.addEventListener("submit", submitForm);
//# sourceMappingURL=chat.js.map
