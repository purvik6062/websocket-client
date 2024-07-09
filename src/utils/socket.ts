import { SOCKET_BASE_URL } from "@/config/constants";
import { io } from "socket.io-client";

let socket: any;

export const initSocket = () => {
  socket = io(`${SOCKET_BASE_URL}`, {
    transports: ["websocket"],
    withCredentials: true,
  });
  // console.log("socket inti:", socket);
  return socket;
};

export const getSocket = () => socket;

// export const socket = io(`${SOCKET_BASE_URL}`, {
//   withCredentials: true,
// });
