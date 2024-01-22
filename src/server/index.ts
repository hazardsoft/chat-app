import http from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { Coordinates } from "../client/types.js";

const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  socket.broadcast.emit("message", `User ${socket.id} has joined`);
  socket.on("disconnect", (reason) => {
    socket.broadcast.emit(
      "message",
      `User ${socket.id} has left due to ${reason}`,
    );
  });

  socket.on(
    "message",
    (message: string, ackCallback: (error?: Error) => void) => {
      console.log(`Message received from ${socket.id}:`, message);
      socket.broadcast.emit("message", message);
      ackCallback();
    },
  );

  socket.on(
    "location",
    (coords: Coordinates, ackCallback: (error?: Error) => void) => {
      console.log(`Location received from ${socket.id}:`, coords);
      socket.broadcast.emit(
        "message",
        `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}`,
      );
      ackCallback();
    },
  );

  socket.emit("message", "Welcome!");
});
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
