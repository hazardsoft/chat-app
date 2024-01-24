import { io } from "socket.io-client";
import { setSocket as setMessageSocket } from "./message.js";
import { setSocket as setLocationSocket } from "./location.js";
import { addLocationMessage, addMessage } from "./messages.js";
import {
  Connection,
  LocationMessage,
  Message,
  RoomMeta,
} from "../shared/types.js";
import { MessageType } from "../shared/consts.js";
import { getConnectionProps } from "./connection.js";
import { setUsers } from "./sidebar.js";

const socket = io();
socket.on("connect", () => {
  const connection: Connection = getConnectionProps();
  console.log(`Client connected to the server`, connection);

  socket.emit(MessageType.cs.join, connection, (error?: Error) => {
    if (error) {
      console.error(`Error joining the room:`, error);
      return;
    }
    console.log(`Room joined successfully`);
  });
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

socket.on(MessageType.sc.roomMeta, (payload: RoomMeta) => {
  console.log(`Rooms meta received from the server:`, payload);
  setUsers(payload.roomId, payload.users);
});

setMessageSocket(socket);
setLocationSocket(socket);
