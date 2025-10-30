import type { ChangeEvent } from "react";
import { useWebSocketContext } from "../WebSocketProvider/WebSocketContext.js"
import type { UserData } from "../WebSocketProvider/UserData.js";
import './Connection.css'
import AnimatedText from "../AnimatedText/AnimatedText.js";

export default function ConnectionPage()
{
    const data = useWebSocketContext();
    return (
        <div id="connection-container">
            <AnimatedText animationFunction={(i, t) => Math.sin(t * 4 + i * 0.4) * 2} Element={'h1'}>Waiting for players...</AnimatedText>
            {/* <input type="text" name="" id="" value={data?.user?.userData?.name} onChange={(e: ChangeEvent) => {
                const name = (e.target as HTMLInputElement).value;
                data?.user?.setUserData((u: UserData) => ({...u, name}))
                localStorage.setItem("name", name);
            }} /> */}
            {Array.from(Array(data?.user?.userData?.numOfConnections)).map((_: any, i: number) => (
                <div key={i} className="player-card">
                    <h1 >{data?.user?.userData?.name}</h1>
                </div>
            ))}
        </div>
    )
}