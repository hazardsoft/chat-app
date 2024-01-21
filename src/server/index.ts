import http from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";

const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
  socket.emit("counterUpdated", 1);
});
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
