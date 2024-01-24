import { Server, Socket } from "socket.io";
import { Connection, User } from "../shared/types";

const connections: Map<Socket, Connection> = new Map();

const registerConnection = (socket: Socket, connection: Connection) => {
  connections.set(socket, connection);
};

const removeConnection = (socket: Socket) => {
  connections.delete(socket);
};

const getConnection = (socket: Socket): Connection | undefined => {
  return connections.get(socket);
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

const getUsersInRoomWithSocket = async (
  io: Server,
  socket: Socket,
): Promise<User[]> => {
  const rooms = socket.rooms;
  const socketIds = await io.sockets.adapter.sockets(rooms);
  const usersInRoom: User[] = [];
  connections.forEach((connection, socket) => {
    if (socketIds.has(socket.id)) {
      usersInRoom.push(connection.user);
    }
  });
  return usersInRoom;
};

export {
  getBroadcasterForAllSockets,
  getBroadcasterForAllSocketsExceptSender,
  registerConnection,
  removeConnection,
  getConnection,
  getUsersInRoomWithSocket,
};
