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
const form = document.getElementById("message-form");
const input = form.elements.namedItem("message");
const button$1 = form.elements.namedItem("submit");
form.addEventListener("submit", submitMessage);

let coords;
let socket$1;
let labelTimeout;
const setSocket = (s) => {
    socket$1 = s;
    detectCurrentPosition();
};
const submitLocation = () => {
    console.log("Sending location...", coords);
    button.textContent = "Sending...";
    button.disabled = true;
    socket$1.emit(MessageType.cs.location, coords, (error) => {
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
        }, 900);
    });
};
const detectCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
        button.textContent = "Send location";
        button.disabled = false;
    }, (positionError) => {
        button.textContent = `Error getting location: ${positionError.message}`;
        button.disabled = true;
    });
};
const button = document.getElementById("send-location-btn");
button.disabled = true;
button.addEventListener("click", submitLocation);

const messages = document.getElementById("messages");
const messageTemplate = document.getElementById("message-template");
const locationMessageTemplate = document.getElementById("location-message-template");
const addMessage = (payload) => {
    const { message, createdAt, name } = payload;
    const html = mustache.render(messageTemplate.innerHTML, {
        message,
        createdAt: moment(createdAt).format("h:mm a"),
        creator: name,
    });
    messages.insertAdjacentHTML("beforeend", html);
};
const addLocationMessage = (payload) => {
    const { createdAt, url, name } = payload;
    const html = mustache.render(locationMessageTemplate.innerHTML, {
        createdAt: moment(createdAt).format("h:mm a"),
        url,
        creator: name,
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
