import { Socket } from "socket.io-client";

let socket: Socket;

const setSocket = (s: Socket) => {
  socket = s;
};

const submitMessage = (event: SubmitEvent) => {
  event.preventDefault();

  const message: string = input.value;
  button.disabled = true;
  console.log("Sending message...", message);
  socket.emit("message", message, (error?: Error): void => {
    if (error) {
      console.error(`Error sending message:`, error);
      return;
    }
    console.log("Message sent!");
    input.value = "";
    input.focus();
    button.disabled = false;
  });
};

const form = document.getElementById("message-form") as HTMLFormElement;
const input = form.elements.namedItem("message") as HTMLInputElement;
const button = form.elements.namedItem("submit") as HTMLButtonElement;
form.addEventListener("submit", submitMessage);

export { setSocket };
