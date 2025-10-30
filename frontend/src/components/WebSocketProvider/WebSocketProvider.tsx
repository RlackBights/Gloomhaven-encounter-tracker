import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { WebSocketData } from "./WebSocketData.js";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WebSocketContext } from "./WebSocketContext.js";
import type { UserData } from "./UserData.js";

export default function WebSocketProvider({ children }: { children: ReactNode })
{
    const [userData, setUserData] = useState<UserData | null>(null)

    const { sendJsonMessage, lastJsonMessage, readyState }: WebSocketData = useWebSocket(
        `/api?name=${localStorage.getItem("name")}&color=${localStorage.getItem("color")?.substring(1)}`,
        {
            share: false,
            shouldReconnect: () => true,
        },
    )

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            console.log("Connected!")
        }
    }, [readyState])

    useEffect(() => {
        if (readyState === ReadyState.CONNECTING || !lastJsonMessage) return;
        switch (lastJsonMessage.type) {
            case 0:
                localStorage.setItem("name", lastJsonMessage.name);
                localStorage.setItem("color", lastJsonMessage.color);
                setUserData(u => {
                    let n: UserData = { ...u, name: lastJsonMessage.name, color: lastJsonMessage.color, numOfConnections: u ? u.numOfConnections : 1, otherNames: u ? u.otherNames : [], otherColors: u ? u.otherColors : [] };
                    return n
                })
                break;
            case 1:
                setUserData(u => {
                    let n: UserData = { ...u, name: ((u !== null) ? u.name : ((localStorage.getItem("name") !== null) ? localStorage.getItem("name") : ""))!, color: u ? u.color : "#808080", numOfConnections: lastJsonMessage.num, otherNames: lastJsonMessage.others, otherColors: lastJsonMessage.otherColors };
                    return n
                })
                break;
            case 2:
                setUserData(u => ({...u!, numOfConnections: lastJsonMessage.num, otherNames: lastJsonMessage.others}))
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