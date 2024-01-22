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

export { Coordinates, Message, LocationMessage };
