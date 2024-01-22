import { io } from "socket.io-client";
import { setSocket as setMessageSocket } from "./message.js";
import { setSocket as setLocationSocket } from "./location.js";
import { addLocationMessage, addMessage } from "./messages.js";
import { LocationMessage, Message } from "../shared/types.js";
import { MessageType } from "../shared/consts.js";

const socket = io();
socket.on("connect", () => {
  console.log(`Client connected to the server`);
});
socket.on("disconnect", () => {
  console.log(`Client disconnected from the server`);
});
socket.on(MessageType.sc.message, (payload: Message) => {
  console.log(`Message received from the server:`, payload);
  addMessage(payload);
});

socket.on(MessageType.sc.location, (payload: LocationMessage) => {
  console.log(`Location message received from the server:`, payload);
  addLocationMessage(payload);
});

setMessageSocket(socket);
setLocationSocket(socket);
