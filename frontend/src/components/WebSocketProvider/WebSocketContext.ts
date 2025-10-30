import { createContext, useContext } from "react";
import type { WebSocketData } from "./WebSocketData.js";
import type { UserData } from "./UserData.js";

export const WebSocketContext = createContext<{ socket: WebSocketData, user: { userData: UserData[], setUserData: Function } } | null>(null);
export const useWebSocketContext = () => useContext(WebSocketContext);