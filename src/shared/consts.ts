const MessageType = {
  cs: {
    message: "clientMessage",
    location: "clientLocation",
    join: "clientJoin",
  },
  sc: {
    message: "serverMessage",
    location: "serverLocation",
    roomMeta: "serverRoomMeta",
  },
} as const;

export { MessageType };
