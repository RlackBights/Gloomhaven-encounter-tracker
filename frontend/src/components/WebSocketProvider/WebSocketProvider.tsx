import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { WebSocketData } from "./WebSocketData.js";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WebSocketContext } from "./WebSocketContext.js";
import type { UserData } from "./UserData.js";

export default function WebSocketProvider({ children }: { children: ReactNode })
{
    const [userData, setUserData] = useState<UserData | null>(null)

    const { sendJsonMessage, lastJsonMessage, readyState }: WebSocketData = useWebSocket(
        `/api?name=${localStorage.getItem("name")}`,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )

    useEffect(() => {
        console.log("Connection state changed")
        if (readyState === ReadyState.OPEN) {
            console.log("Connected!")
        }
    }, [readyState])

    useEffect(() => {
        if (readyState === ReadyState.CONNECTING || !lastJsonMessage) return;
        switch (lastJsonMessage.type) {
            case 0:
                localStorage.setItem("name", lastJsonMessage.name);
                setUserData(u => {
                    let n: UserData = { name: lastJsonMessage.name, numOfConnections: u ? u.numOfConnections : 1 };
                    return n
                })
                break;
            case 1:
                setUserData(u => {
                    let n: UserData = { name: ((u !== null) ? u.name : ((localStorage.getItem("name") !== null) ? localStorage.getItem("name") : ""))!, numOfConnections: lastJsonMessage.num };
                    return n
                })
                break;
            case 2:
                setUserData(u => ({...u!, numOfConnections: lastJsonMessage.num}))
                break;
            default:
                break;
        }
        console.log(lastJsonMessage);
    }, [lastJsonMessage])

    const socketData: WebSocketData = { sendJsonMessage, lastJsonMessage, readyState };
    return (
        <WebSocketContext.Provider value={{socket: socketData, user: { userData, setUserData }}}>
            {children}
        </WebSocketContext.Provider>
    );
}