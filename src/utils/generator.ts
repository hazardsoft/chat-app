import { LocationMessage, Message } from "../shared/types";

const generateMessage = (message: string): Message => {
  return {
    message,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (url: string): LocationMessage => {
  return {
    url,
    createdAt: new Date().getTime(),
  };
};

export { generateMessage, generateLocationMessage };
