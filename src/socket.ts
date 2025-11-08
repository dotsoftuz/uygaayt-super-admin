import { io } from "socket.io-client";

const url = process.env.REACT_APP_SOCKET_URL;
const path = process.env.REACT_APP_SOCKET_PATH;

const storeId = localStorage.getItem("storeId");
const tokenData = localStorage.getItem("token");
console.log(tokenData);


export const socket = io(url!, {
  autoConnect: true,
  transports: ["websocket"],
  auth: {
    token: tokenData,
    // storeid: storeId, // required when employee connected
  },
  path: path,
});

export const initializeSocket = (token: any) => {
  socket.auth = { token };
  socket.connect();
};
