import http from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { Connection, Coordinates, RoomMeta, User } from "../shared/types.js";
import { MessageType } from "../shared/consts.js";
import {
  generateLocationMessage,
  generateMessage,
} from "../utils/generator.js";
import {
  getBroadcasterForAllSockets,
  getBroadcasterForAllSocketsExceptSender,
  getUsersInRoomWithSocket,
  registerConnection,
  removeConnection,
  getConnection,
} from "./rooms.js";

const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  socket.on("disconnect", async () => {
    const connection = getConnection(socket);
    if (!connection) {
      return;
    }
    removeConnection(socket);

    getBroadcasterForAllSocketsExceptSender(io, socket).emit(
      MessageType.sc.message,
      generateMessage(`User ${connection.user.name} has left`),
    );

    const usersInRoom: User[] = await getUsersInRoomWithSocket(io, socket);
    const roomMeta: RoomMeta = {
      roomId: connection.roomId,
      users: usersInRoom,
    };
    getBroadcasterForAllSockets(io, socket).emit(
      MessageType.sc.roomMeta,
      roomMeta,
    );
  });

  socket.on(
    MessageType.cs.message,
    (message: string, ackCallback: (error?: Error) => void) => {
      const connection = getConnection(socket);
      console.log(`Message received from ${connection?.user.name}:`, message);

      getBroadcasterForAllSockets(io, socket).emit(
        MessageType.sc.message,
        generateMessage(message, connection?.user.name),
      );
      ackCallback();
    },
  );

  socket.on(
    MessageType.cs.location,
    (coords: Coordinates, ackCallback: (error?: Error) => void) => {
      const connection = getConnection(socket);
      console.log(`Location received from ${connection?.user.name}:`, coords);

      getBroadcasterForAllSockets(io, socket).emit(
        MessageType.sc.location,
        generateLocationMessage(
          `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}`,
          connection?.user.name,
        ),
      );
      ackCallback();
    },
  );

  socket.on(
    MessageType.cs.join,
    async (connection: Connection, ackCallback: (error?: Error) => void) => {
      console.log(`Received request from client to join`, connection);
      await socket.join(connection.roomId);
      registerConnection(socket, connection);

      socket.emit(
        MessageType.sc.message,
        generateMessage(
          `Welcome, ${connection.user.name}, in room ${connection.roomId}!`,
        ),
      );
      ackCallback();
      getBroadcasterForAllSocketsExceptSender(io, socket).emit(
        MessageType.sc.message,
        generateMessage(`User ${connection.user.name} has joined`),
      );

      const usersInRoom: User[] = await getUsersInRoomWithSocket(io, socket);
      const roomMeta: RoomMeta = {
        roomId: connection.roomId,
        users: usersInRoom,
      };
      getBroadcasterForAllSockets(io, socket).emit(
        MessageType.sc.roomMeta,
        roomMeta,
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
