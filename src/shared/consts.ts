const MessageType = {
  cs: {
    message: "clientMessage",
    location: "clientLocation",
  },
  sc: {
    message: "serverMessage",
    location: "serverLocation",
  },
} as const;

export { MessageType };
