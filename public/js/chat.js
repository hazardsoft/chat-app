import { io } from 'socket.io-client';
import mustache from 'mustache';
import moment from 'moment';

const MessageType = {
    cs: {
        message: "clientMessage",
        location: "clientLocation",
    },
    sc: {
        message: "serverMessage",
        location: "serverLocation",
    },
};

let socket$2;
const setSocket$1 = (s) => {
    socket$2 = s;
};
const submitMessage = (event) => {
    event.preventDefault();
    const message = input.value;
    button$1.disabled = true;
    console.log("Sending message...", message);
    socket$2.emit(MessageType.cs.message, message, (error) => {
        if (error) {
            console.error(`Error sending message:`, error);
            return;
        }
        console.log("Message sent!");
        input.value = "";
        input.focus();
        button$1.disabled = false;
    });
};
const form$1 = document.getElementById("message-form");
const input = form$1.elements.namedItem("message");
const button$1 = form$1.elements.namedItem("submit");
form$1.addEventListener("submit", submitMessage);

let coords;
let socket$1;
const setSocket = (s) => {
    socket$1 = s;
    detectCurrentPosition();
};
const submitLocation = (event) => {
    event.preventDefault();
    console.log("Sending location...", coords);
    button.disabled = true;
    socket$1.emit(MessageType.cs.location, coords, (error) => {
        if (error) {
            console.log(`Error sending location:`, error);
            return;
        }
        console.log(`Location sent!`);
        button.disabled = false;
    });
};
const detectCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
        p.textContent = `Long: ${coords.longitude}, Lat: ${coords.latitude}`;
        button.disabled = false;
    }, (positionError) => {
        p.textContent = `Error getting location: ${positionError.message}`;
        button.disabled = true;
    });
};
const form = document.getElementById("location-form");
const p = form.querySelector("p");
const button = form.elements.namedItem("submit");
button.disabled = true;
form.addEventListener("submit", submitLocation);

const messages = document.getElementById("messages");
const messageTemplate = document.getElementById("message-template");
const locationMessageTemplate = document.getElementById("location-message-template");
const addMessage = (payload) => {
    const { message, createdAt } = payload;
    const html = mustache.render(messageTemplate.innerHTML, {
        message,
        createdAt: moment(createdAt).format("h:mm a"),
    });
    messages.insertAdjacentHTML("beforeend", html);
};
const addLocationMessage = (payload) => {
    const { createdAt, url } = payload;
    const html = mustache.render(locationMessageTemplate.innerHTML, {
        createdAt: moment(createdAt).format("h:mm a"),
        url,
    });
    messages.insertAdjacentHTML("beforeend", html);
};

const socket = io();
socket.on("connect", () => {
    console.log(`Client connected to the server`);
});
socket.on("disconnect", () => {
    console.log(`Client disconnected from the server`);
});
socket.on(MessageType.sc.message, (payload) => {
    console.log(`Message received from the server:`, payload);
    addMessage(payload);
});
socket.on(MessageType.sc.location, (payload) => {
    console.log(`Location message received from the server:`, payload);
    addLocationMessage(payload);
});
setSocket$1(socket);
setSocket(socket);
//# sourceMappingURL=chat.js.map
