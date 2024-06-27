import { io } from "socket.io-client";

let socket: any;

export const initSocket = () => {
  socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
    transports: ["websocket"],
  });
  console.log("socket inti:", socket);
  return socket;
};

export const getSocket = () => socket;
