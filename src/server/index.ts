import http from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { Connection, Coordinates } from "../shared/types.js";
import { MessageType } from "../shared/consts.js";
import {
  generateLocationMessage,
  generateMessage,
} from "../utils/generator.js";
import {
  getBroadcasterForAllSockets,
  getBroadcasterForAllSocketsExceptSender,
  getUser,
  registerUser,
  removeUser,
} from "./rooms.js";

const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    const user = getUser(socket);
    removeUser(socket);

    getBroadcasterForAllSocketsExceptSender(io, socket).emit(
      MessageType.sc.message,
      generateMessage(`User ${user?.name} has left due to ${reason}`),
    );
  });

  socket.on(
    MessageType.cs.message,
    (message: string, ackCallback: (error?: Error) => void) => {
      const user = getUser(socket);

      console.log(`Message received from ${user?.name}:`, message);
      getBroadcasterForAllSockets(io, socket).emit(
        MessageType.sc.message,
        generateMessage(message, user?.name),
      );
      ackCallback();
    },
  );

  socket.on(
    MessageType.cs.location,
    (coords: Coordinates, ackCallback: (error?: Error) => void) => {
      const user = getUser(socket);

      console.log(`Location received from ${user?.name}:`, coords);
      getBroadcasterForAllSockets(io, socket).emit(
        MessageType.sc.location,
        generateLocationMessage(
          `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}`,
          user?.name,
        ),
      );
      ackCallback();
    },
  );

  socket.on(
    MessageType.cs.join,
    async (connection: Connection, ackCallback: (error?: Error) => void) => {
      console.log(`Received request from client to join`, connection);
      await socket.join(connection.room);
      registerUser(socket, connection.user);

      socket.emit(
        MessageType.sc.message,
        generateMessage(
          `Welcome, ${connection.user.name}, in room ${connection.room}!`,
        ),
      );
      ackCallback();
      getBroadcasterForAllSocketsExceptSender(io, socket).emit(
        MessageType.sc.message,
        generateMessage(`User ${connection.user.name} has joined`),
      );
    },
  );
});

io.of("/").adapter.on("create-room", (room) => {
  console.log(`Room ${room} created`);
});
io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`Socket ${id} joined room ${room}`);
});
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
