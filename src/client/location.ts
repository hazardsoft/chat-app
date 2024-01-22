import { Socket } from "socket.io-client";
import { Coordinates } from "./types";

let coords: Coordinates;
let socket: Socket;

const setSocket = (s: Socket) => {
  socket = s;
  detectCurrentPosition();
};

const submitLocation = (event: SubmitEvent) => {
  event.preventDefault();

  console.log("Sending location...", coords);
  button.disabled = true;
  socket.emit("location", coords, (error?: Error) => {
    if (error) {
      console.log(`Error sending location:`, error);
      return;
    }
    console.log(`Location sent!`);
    button.disabled = false;
  });
};

const detectCurrentPosition = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      p.textContent = `Long: ${coords.longitude}, Lat: ${coords.latitude}`;
      button.disabled = false;
    },
    (positionError) => {
      p.textContent = `Error getting location: ${positionError.message}`;
      button.disabled = true;
    },
  );
};

const form = document.getElementById("location-form") as HTMLFormElement;
const p = form.querySelector("p") as HTMLParagraphElement;
const button = form.elements.namedItem("submit") as HTMLButtonElement;
button.disabled = true;
form.addEventListener("submit", submitLocation);

export { setSocket };
