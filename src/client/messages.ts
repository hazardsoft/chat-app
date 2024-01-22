import mustache from "mustache";

const messages = document.getElementById("messages") as HTMLDivElement;
const messageTemplate = document.getElementById(
  "message-template",
) as HTMLTemplateElement;

const addMessage = (message: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const html: string = mustache.render(messageTemplate.innerHTML, { message });
  messages.insertAdjacentHTML("beforeend", html);
};

export { addMessage };
