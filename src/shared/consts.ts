const MessageType = {
  cs: {
    message: "clientMessage",
    location: "clientLocation",
    join: "clientJoin",
  },
  sc: {
    message: "serverMessage",
    location: "serverLocation",
  },
} as const;

export { MessageType };
