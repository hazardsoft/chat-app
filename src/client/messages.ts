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

const autoscroll = () => {
  const newMessage = messages.lastElementChild as HTMLElement;
  const { marginBottom, marginTop } = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(marginBottom) + parseInt(marginTop);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
  console.log(`new message height: ${newMessageHeight}`);

  const visibleHeight = messages.offsetHeight;
  const containerHeight = messages.scrollHeight;
  const scrollOffset = visibleHeight + messages.scrollTop;
  const wasScrolledToTheBottom =
    containerHeight - newMessageHeight <= Math.ceil(scrollOffset);
  if (wasScrolledToTheBottom) {
    messages.scrollTop = messages.scrollHeight;
  }
};

const addMessage = (payload: Message) => {
  const { message, createdAt, name } = payload;
  const html: string = mustache.render(messageTemplate.innerHTML, {
    message,
    createdAt: moment(createdAt).format("h:mm a"),
    creator: name,
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
};

const addLocationMessage = (payload: LocationMessage) => {
  const { createdAt, url, name } = payload;
  const html = mustache.render(locationMessageTemplate.innerHTML, {
    createdAt: moment(createdAt).format("h:mm a"),
    url,
    creator: name,
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
};

export { addMessage, addLocationMessage };
