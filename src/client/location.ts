import { Socket } from "socket.io-client";
import { Coordinates } from "../shared/types";
import { MessageType } from "../shared/consts";

let coords: Coordinates;
let socket: Socket;
let labelTimeout: number;

const setSocket = (s: Socket) => {
  socket = s;
  detectCurrentPosition();
};

const submitLocation = () => {
  console.log("Sending location...", coords);
  button.textContent = "Sending...";
  button.disabled = true;
  socket.emit(MessageType.cs.location, coords, (error?: Error) => {
    if (error) {
      console.log(`Error sending location:`, error);
      return;
    }
    console.log(`Location sent!`);
    button.disabled = false;
    button.textContent = "Location sent!";
    clearTimeout(labelTimeout);
    labelTimeout = setTimeout(() => {
      button.textContent = "Send location";
    }, 900) as unknown as number;
  });
};

const detectCurrentPosition = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      button.textContent = "Send location";
      button.disabled = false;
    },
    (positionError) => {
      button.textContent = `Error getting location: ${positionError.message}`;
      button.disabled = true;
    },
  );
};

const button = document.getElementById(
  "send-location-btn",
) as HTMLButtonElement;
button.disabled = true;
button.addEventListener("click", submitLocation);

export { setSocket };
