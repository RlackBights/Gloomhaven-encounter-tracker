import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { WebSocketData } from "./WebSocketData.js";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WebSocketContext } from "./WebSocketContext.js";
import type { UserData } from "./UserData.js";
import { usePageContext } from "../Main/PageContext.js";

export default function WebSocketProvider({ children }: { children: ReactNode })
{
    const [userData, setUserData] = useState<UserData[]>([])

    const page = usePageContext();
    const { sendJsonMessage, lastJsonMessage, readyState }: WebSocketData = useWebSocket(
        `/api?id=${localStorage.getItem("id")}`,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )

    useEffect(() => {
        if (readyState === ReadyState.CONNECTING || !lastJsonMessage) return;

        switch (lastJsonMessage.type) {
            case 0:
                localStorage.setItem("id", lastJsonMessage.id);
                break;
            case 1:
                setUserData(lastJsonMessage.users);
                
                page.setCurrentPage(lastJsonMessage.page)
                break;
            default:
                break;
        }
    }, [lastJsonMessage])

    useEffect(() => {
        sendJsonMessage({type: 1, page: page.currentPage})
    }, [page.currentPage])

    const socketData: WebSocketData = { sendJsonMessage, lastJsonMessage, readyState };
    return (
        <WebSocketContext.Provider value={{socket: socketData, user: { userData, setUserData }}}>
            {children}
        </WebSocketContext.Provider>
    );
}