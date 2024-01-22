import { LocationMessage, Message } from "../shared/types";

const generateMessage = (
  message: string,
  creator: string = "Server",
): Message => {
  return {
    message,
    createdAt: new Date().getTime(),
    name: creator,
  };
};

const generateLocationMessage = (
  url: string,
  creator: string,
): LocationMessage => {
  return {
    url,
    createdAt: new Date().getTime(),
    name: creator,
  };
};

export { generateMessage, generateLocationMessage };
