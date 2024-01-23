import { Server, Socket } from "socket.io";
import { User } from "../shared/types";

const users: Map<Socket, User> = new Map();

const registerUser = (socket: Socket, user: User) => {
  users.set(socket, user);
};

const removeUser = (socket: Socket) => {
  users.delete(socket);
};

const getUser = (socket: Socket): User | undefined => {
  return users.get(socket);
};

const getBroadcasterForAllSockets = (
  io: Server,
  socket: Socket,
): ReturnType<typeof io.to> => {
  const roomIds = Array.from(socket.rooms);
  return io.to(roomIds);
};

const getBroadcasterForAllSocketsExceptSender = (
  io: Server,
  socket: Socket,
): ReturnType<typeof io.to> => {
  const roomIds = Array.from(socket.rooms);
  return socket.to(roomIds);
};

export {
  getBroadcasterForAllSockets,
  getBroadcasterForAllSocketsExceptSender,
  registerUser,
  removeUser,
  getUser,
};
