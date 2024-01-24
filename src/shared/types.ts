type Coordinates = {
  longitude: number;
  latitude: number;
};

type CreatedAt = {
  createdAt: number;
};

type Creator = {
  name: string;
};

type Message = {
  message: string;
} & CreatedAt &
  Creator;

type LocationMessage = {
  url: string;
} & CreatedAt &
  Creator;

type User = {
  name: string;
};

type RoomId = string;

type Connection = {
  user: User;
  roomId: RoomId;
};

type RoomMeta = {
  roomId: RoomId;
  users: User[];
};

export { Coordinates, Message, LocationMessage, Connection, User, RoomMeta };
