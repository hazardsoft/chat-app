import http from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { Coordinates } from "../shared/types.js";
import { MessageType } from "../shared/consts.js";
import {
  generateLocationMessage,
  generateMessage,
} from "../utils/generator.js";

const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  socket.broadcast.emit(
    MessageType.sc.message,
    generateMessage(`User ${socket.id} has joined`),
  );

  socket.on("disconnect", (reason) => {
    socket.broadcast.emit(
      MessageType.sc.message,
      generateMessage(`User ${socket.id} has left due to ${reason}`),
    );
  });

  socket.on(
    MessageType.cs.message,
    (message: string, ackCallback: (error?: Error) => void) => {
      console.log(`Message received from ${socket.id}:`, message);
      io.emit(MessageType.sc.message, generateMessage(message));
      ackCallback();
    },
  );

  socket.on(
    MessageType.cs.location,
    (coords: Coordinates, ackCallback: (error?: Error) => void) => {
      console.log(`Location received from ${socket.id}:`, coords);
      io.emit(
        MessageType.sc.location,
        generateLocationMessage(
          `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}`,
        ),
      );
      ackCallback();
    },
  );

  socket.emit(MessageType.sc.message, generateMessage("Welcome!"));
});
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
