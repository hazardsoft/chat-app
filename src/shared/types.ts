type Coordinates = {
  longitude: number;
  latitude: number;
};

type CreatedAt = {
  createdAt: number;
};

type Message = {
  message: string;
} & CreatedAt;

type LocationMessage = {
  url: string;
} & CreatedAt;

export { Coordinates, Message, LocationMessage };
