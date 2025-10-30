import { createContext, useContext } from "react";
import type { WebSocketData } from "./WebSocketData.js";
import type { UserData } from "./UserData.js";

export const WebSocketContext = createContext<{ socket: WebSocketData, user: { userData: UserData | null, setUserData: Function } | null } | null>(null);
export const useWebSocketContext = () => useContext(WebSocketContext);