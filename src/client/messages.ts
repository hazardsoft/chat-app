import mustache from "mustache";
import moment from "moment";
import { LocationMessage, Message } from "../shared/types";

const messages = document.getElementById("messages") as HTMLDivElement;
const messageTemplate = document.getElementById(
  "message-template",
) as HTMLTemplateElement;
const locationMessageTemplate = document.getElementById(
  "location-message-template",
) as HTMLTemplateElement;

const addMessage = (payload: Message) => {
  const { message, createdAt } = payload;
  const html: string = mustache.render(messageTemplate.innerHTML, {
    message,
    createdAt: moment(createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
};

const addLocationMessage = (payload: LocationMessage) => {
  const { createdAt, url } = payload;
  const html = mustache.render(locationMessageTemplate.innerHTML, {
    createdAt: moment(createdAt).format("h:mm a"),
    url,
  });
  messages.insertAdjacentHTML("beforeend", html);
};

export { addMessage, addLocationMessage };
