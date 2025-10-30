import { useState, type ChangeEvent, type ReactNode } from "react";
import { useWebSocketContext } from "../WebSocketProvider/WebSocketContext.js"
import type { UserData } from "../WebSocketProvider/UserData.js";
import './Connection.css'
import AnimatedText from "../AnimatedText/AnimatedText.js";
import { FaStarOfLife } from "react-icons/fa";
import EditOverlay from "../EditOverlay/EditOverlay.js";

export default function ConnectionPage()
{
    const [editorOpen, setEditorOpen] = useState<boolean>(false);
    const data = useWebSocketContext();

    const setCurrUser = (user: UserData) => {
        data?.user.setUserData((users: UserData[]) => {
            const index = users.findIndex(u => u.id == user.id)
            users[index] = user;
            
            return users
        })
    }

    function hexToRgb(hex: string) {
        let result: string[] | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1]!, 16),
            g: parseInt(result[2]!, 16),
            b: parseInt(result[3]!, 16)
        } : null;
    }

    console.log(data?.user.userData[0]?.id === parseInt(localStorage.getItem("id")!));
    
    return (
        <div id="connection-container">
            <AnimatedText animationFunction={(i, t) => Math.sin(t * 4 + i * 0.4) * 2} Element={'h1'}>Waiting for players...</AnimatedText>
            {data?.user.userData.sort(u => u.id).map((user: UserData, i: number) => {
                const isCurrentUser = user.id === parseInt(localStorage.getItem("id")!);
                const isLight = (hexToRgb(user.color)!.r * 0.299 + hexToRgb(user.color)!.g * 0.587 + hexToRgb(user.color)!.b * 0.114) > 186;
                return (
                    <div key={i} className="player-card-wrapper">
                        { isCurrentUser && editorOpen && <EditOverlay editorOpen setEditorOpen={setEditorOpen} currUser={user} setCurrUser={setCurrUser} index={i} /> }
                        <div className="player-card" style={{backgroundColor: user.color}} data-current-player={isCurrentUser} onClick={!isCurrentUser ? () => {} : () => {
                            setEditorOpen(true)
                        }}>
                            { isCurrentUser && <FaStarOfLife /> }
                            <h1 style={{ color: isLight ? "black" : "white" }} >{user.name}</h1>
                        </div>
                        <div className="player-card-shadow" style={{backgroundColor: user.color}}></div>
                    </div>
                )
            })}
        </div>
    )
}