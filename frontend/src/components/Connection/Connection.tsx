import { useState, type ChangeEvent, type ReactNode } from "react";
import { useWebSocketContext } from "../WebSocketProvider/WebSocketContext.js"
import type { UserData } from "../WebSocketProvider/UserData.js";
import './Connection.css'
import AnimatedText from "../AnimatedText/AnimatedText.js";
import { FaStarOfLife } from "react-icons/fa";
import EditOverlay from "../EditOverlay/EditOverlay.js";
import Patterns from "../../assets/index.js";
import { BiSolidRightArrow } from "react-icons/bi";
import { usePageContext } from "../Main/PageContext.js";
import { hexToRgb, isLight } from "../Tools/Tools.js";
import Pages from "../Main/Pages.js";

export default function ConnectionPage()
{
    const [editorOpen, setEditorOpen] = useState<boolean>(false);
    const data = useWebSocketContext();
    const page = usePageContext();

    const setCurrUser = (user: UserData) => {
        data?.user.setUserData((users: UserData[]) => {
            const index = users.findIndex(u => u.id == user.id)
            users[index] = user;
            
            return users
        })
    }
    
    return (
        <div id="connection-container" style={{display: "none"}}>
            <AnimatedText animationFunction={(i, t) => Math.sin(t * 4 + i * 0.4) * 2} Element={'h1'}>Waiting for players...</AnimatedText>
            <div id="start-btn" onClick={() => {
                data?.socket.sendJsonMessage({type: 1, page: Pages.INITIATIVE})
            }}>
                <BiSolidRightArrow />
            </div>
            {data?.user.userData.sort(u => u.id).map((user: UserData, i: number) => {
                const isCurrentUser = user.id === parseInt(localStorage.getItem("id")!);
                const light = isLight(hexToRgb(user.color)!);
                return (
                    <div key={i} className="player-card-wrapper">
                        { isCurrentUser && editorOpen && <EditOverlay setEditorOpen={setEditorOpen} currUser={user} index={i} /> }
                        <div className="player-card" style={{backgroundColor: user.color, backgroundImage: `url("${Patterns[user.pattern]}")`}} data-current-player={isCurrentUser} onClick={!isCurrentUser ? () => {} : () => {
                            setEditorOpen(true)
                        }}>
                            { isCurrentUser && <FaStarOfLife style={{ color: light ? "black" : "white" }} /> }
                            <h1 style={{ color: light ? "black" : "white" }} >{user.name}</h1>
                        </div>
                        <div className="player-card-shadow" style={{backgroundColor: user.color }}></div>
                    </div>
                )
            })}
        </div>
    )
}