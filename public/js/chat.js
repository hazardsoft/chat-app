import { io } from 'socket.io-client';

const socket = io();
socket.on("connect", () => {
    console.log(`Client connected to the server`);
});
socket.on("disconnect", () => {
    console.log(`Client disconnected from the server`);
});
socket.on("message", (message) => {
    console.log(`Message received from the server:`, message);
});
let coords;
const submitMessage = (event) => {
    event.preventDefault();
    const form = event.target;
    const input = form.elements.namedItem("message");
    const message = input.value;
    console.log(`Message (${message}) sent!`);
    socket.emit("message", message);
};
const submitLocation = (event) => {
    event.preventDefault();
    console.log(`Sending location...`, coords);
    socket.emit("location", coords, (error) => {
        if (error) {
            console.log(`Error sending location:`, error);
            return;
        }
        console.log(`Location sent!`);
    });
};
const messageForm = document.getElementById("message-form");
messageForm.addEventListener("submit", submitMessage);
const p = document.getElementById("location");
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
        p.textContent = `Long: ${coords.longitude}, Lat: ${coords.latitude}`;
        const locationForm = document.getElementById("location-form");
        locationForm.addEventListener("submit", submitLocation);
    }, (positionError) => {
        p.textContent = `Error getting location: ${positionError.message}`;
    });
}
//# sourceMappingURL=chat.js.map
