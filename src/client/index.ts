import { io } from "socket.io-client";

const socket = io();
socket.on("connect", () => {
  console.log(`Client connected to the server`);
});
socket.on("disconnect", () => {
  console.log(`Client disconnected from the server`);
});
socket.on("message", (message: string) => {
  console.log(`Message received from the server: ${message}`);
});

const submitForm = (event: SubmitEvent) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const input = form.elements.namedItem("message") as HTMLInputElement;
  const message: string = input.value;

  console.log(`Message (${message}) sent!`);
  socket.emit("message", message);
};

const form = document.getElementById("messageForm") as HTMLFormElement;
form.addEventListener("submit", submitForm);
