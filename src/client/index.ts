import { io } from "socket.io-client";
import { setSocket as setMessageSocket } from "./message.js";
import { setSocket as setLocationSocket } from "./location.js";
import { addMessage } from "./messages.js";

const socket = io();
socket.on("connect", () => {
  console.log(`Client connected to the server`);
});
socket.on("disconnect", () => {
  console.log(`Client disconnected from the server`);
});
socket.on("message", (message: string) => {
  console.log(`Message received from the server:`, message);
  addMessage(message);
});

setMessageSocket(socket);
setLocationSocket(socket);
