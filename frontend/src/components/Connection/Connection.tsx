import type { ChangeEvent } from "react";
import { useWebSocketContext } from "../WebSocketProvider/WebSocketContext.js"
import type { UserData } from "../WebSocketProvider/UserData.js";
import './Connection.css'
import AnimatedText from "../AnimatedText/AnimatedText.js";
import { FaStarOfLife } from "react-icons/fa";

export default function ConnectionPage()
{
    const data = useWebSocketContext();
    return (
        <div id="connection-container">
            <AnimatedText animationFunction={(i, t) => Math.sin(t * 4 + i * 0.4) * 2} Element={'h1'}>Waiting for players...</AnimatedText>
            {[...(data?.user?.userData?.otherNames ?? []), data?.user?.userData?.name].sort().map((name: string | undefined, i: number) => (
                name !== undefined && <div key={i} className="player-card" style={{backgroundColor: (name === data?.user?.userData?.name) ? data.user.userData.color : data?.user?.userData?.otherColors[[...(data?.user?.userData?.otherNames ?? [])].findIndex(n => n === name)]}} data-current-player={name === data?.user?.userData?.name} onClick={name !== data?.user?.userData?.name ? () => {} : () => {
                    data?.user?.setUserData((u: UserData) => ({...u, isEditorOpen: true }))
                }}>
                    {name === data?.user?.userData?.name && <FaStarOfLife />}
                    <div style={{backgroundColor: (name === data?.user?.userData?.name) ? data.user.userData.color : data?.user?.userData?.otherColors[[...(data?.user?.userData?.otherNames ?? [])].findIndex(n => n === name)]}}></div>
                    <h1>{name}</h1>
                </div>
            ))}
        </div>
    )
}