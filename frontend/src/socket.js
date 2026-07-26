import { io } from "socket.io-client";
import { serverUrl } from "./App";

export const socket = io(serverUrl, {
    withCredentials: true
});