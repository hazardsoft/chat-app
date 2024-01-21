import { io } from "socket.io-client";

const socket = io();
socket.on("connect", () => {
  console.log(`Client connected to the server`);
});
socket.on("disconnect", () => {
  console.log(`Client disconnected from the server`);
});
socket.on("counterUpdated", (count: number) => {
  console.log(`Counter updated to ${count}`);
});
