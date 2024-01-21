import { io } from "socket.io-client";
import { Coordinates } from "./types";

const socket = io();
socket.on("connect", () => {
  console.log(`Client connected to the server`);
});
socket.on("disconnect", () => {
  console.log(`Client disconnected from the server`);
});
socket.on("message", (message: string) => {
  console.log(`Message received from the server:`, message);
});

let coords: Coordinates;

const submitMessage = (event: SubmitEvent) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const input = form.elements.namedItem("message") as HTMLInputElement;
  const message: string = input.value;

  console.log(`Message (${message}) sent!`);
  socket.emit("message", message);
};

const submitLocation = (event: SubmitEvent) => {
  event.preventDefault();

  console.log(`Location sent!`, coords);
  socket.emit("location", coords);
};

const messageForm = document.getElementById("message-form") as HTMLFormElement;
messageForm.addEventListener("submit", submitMessage);

const p = document.getElementById("location") as HTMLParagraphElement;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      p.textContent = `Long: ${coords.longitude}, Lat: ${coords.latitude}`;

      const locationForm = document.getElementById(
        "location-form",
      ) as HTMLFormElement;
      locationForm.addEventListener("submit", submitLocation);
    },
    (positionError) => {
      p.textContent = `Error getting location: ${positionError.message}`;
    },
  );
}
