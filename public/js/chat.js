import { io } from 'socket.io-client';
import mustache from 'mustache';
import moment from 'moment';

const MessageType = {
    cs: {
        message: "clientMessage",
        location: "clientLocation",
        join: "clientJoin",
    },
    sc: {
        message: "serverMessage",
        location: "serverLocation",
        roomMeta: "serverRoomMeta",
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
const autoscroll = () => {
    const newMessage = messages.lastElementChild;
    const { marginBottom, marginTop } = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(marginBottom) + parseInt(marginTop);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
    console.log(`new message height: ${newMessageHeight}`);
    const visibleHeight = messages.offsetHeight;
    const containerHeight = messages.scrollHeight;
    const scrollOffset = visibleHeight + messages.scrollTop;
    const wasScrolledToTheBottom = containerHeight - newMessageHeight <= Math.ceil(scrollOffset);
    if (wasScrolledToTheBottom) {
        messages.scrollTop = messages.scrollHeight;
    }
};
const addMessage = (payload) => {
    const { message, createdAt, name } = payload;
    const html = mustache.render(messageTemplate.innerHTML, {
        message,
        createdAt: moment(createdAt).format("h:mm a"),
        creator: name,
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
};
const addLocationMessage = (payload) => {
    const { createdAt, url, name } = payload;
    const html = mustache.render(locationMessageTemplate.innerHTML, {
        createdAt: moment(createdAt).format("h:mm a"),
        url,
        creator: name,
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
};

const getConnectionProps = () => {
    const searchParams = new URLSearchParams(location.search);
    const username = searchParams.get("username") ?? "";
    const roomId = searchParams.get("room") ?? "";
    const connection = {
        user: {
            name: username,
        },
        roomId,
    };
    return connection;
};

const sidebarTemplate = document.getElementById("sidebar-template");
const sidebar = document.getElementById("sidebar");
const setUsers = (roomId, users) => {
    const html = mustache.render(sidebarTemplate.innerHTML, { roomId, users });
    sidebar.innerHTML = html;
};

const socket = io();
socket.on("connect", () => {
    const connection = getConnectionProps();
    console.log(`Client connected to the server`, connection);
    socket.emit(MessageType.cs.join, connection, (error) => {
        if (error) {
            console.error(`Error joining the room:`, error);
            return;
        }
        console.log(`Room joined successfully`);
    });
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
socket.on(MessageType.sc.roomMeta, (payload) => {
    console.log(`Rooms meta received from the server:`, payload);
    setUsers(payload.roomId, payload.users);
});
setSocket$1(socket);
setSocket(socket);
//# sourceMappingURL=chat.js.map
