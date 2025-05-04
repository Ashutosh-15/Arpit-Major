import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_SOCKET_SERVER;

const socket: Socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: false, // important: don't connect immediately
});

export default socket;
