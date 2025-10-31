import { FaCheck } from 'react-icons/fa'
import AnimatedText from '../AnimatedText/AnimatedText.js'
import './InitiativePage.css'
import { useWebSocketContext } from '../WebSocketProvider/WebSocketContext.js'
import type { UserData } from '../WebSocketProvider/UserData.js'
import Patterns from '../../assets/index.js'
import { hexToRgb, isLight } from '../Tools/Tools.js'
import { IoIosClose } from 'react-icons/io'
import { useEffect, useState } from 'react'
import { BiSolidRightArrow } from 'react-icons/bi'
import Pages from '../Main/Pages.js'

export default function InitiativePage()
{
    const data = useWebSocketContext()
    const [ready, setReady] = useState(false);
    useEffect(() => {

        setReady(data?.user.userData.find((u: UserData) => u.id == parseInt(localStorage.getItem("id")!))?.initiativeReady!);
               
    }, [data?.user.userData])

    return (
        <div id='initiative-container' style={{display: "none"}}>
            <h1>Initiative</h1>
            <div id='initiative-players'>
                {data?.user.userData.map((user: UserData, i: number) => {

                    const light = isLight(hexToRgb(user.color)!);
                    return (
                        <div key={i} className='initiative-player-icon' style={{backgroundColor: user.color, backgroundImage: `url("${Patterns[user.pattern]}")`}}>
                            { !user.initiativeReady && <AnimatedText  style={{ color: light ? "black" : "white" }} animationFunction={(i, t) => Math.sin(t * 2 + i * 1)} Element={'h1'}>...</AnimatedText> }
                            { user.initiativeReady && <p  style={{ color: light ? "black" : "white" }}>{user.name[0]}</p> }
                        </div>
                    )
                })}
            </div>
            <div id='initiative-inputs'>
                <input type="number" placeholder='I' min={1} max={99} name="" disabled={data?.user.userData.find(u => u.id == parseInt(localStorage.getItem("id")!))?.initiativeReady} id="initiative-1" />
                <input type="number" placeholder='II' min={1} max={99} name="" disabled={data?.user.userData.find(u => u.id == parseInt(localStorage.getItem("id")!))?.initiativeReady} id="initiative-2" />
                { !ready && <FaCheck onClick={() => {
                    console.log(data?.user.userData);
                    
                    const init1 = document.querySelector('#initiative-1') as HTMLInputElement;
                    const init2 = document.querySelector('#initiative-2') as HTMLInputElement;
                    const init1val = parseInt(init1.value);
                    const init2val = parseInt(init2.value);
                    if ((isNaN(init1val) || init1val < 1 || init1val > 99) || 
                        (isNaN(init2val) || init2val < 1 || init2val > 99)) return;
                    
                    data?.socket.sendJsonMessage({ type: 0, id: localStorage.getItem("id"), initiative_ready: true });
                }} /> }
                { ready && <IoIosClose onClick={() => {
                    (document.querySelector('#initiative-1') as HTMLInputElement).disabled = false;
                    (document.querySelector('#initiative-2') as HTMLInputElement).disabled = false;
                    data?.socket.sendJsonMessage({ type: 0, id: localStorage.getItem("id"), initiative_ready: false });
                }} /> }
            </div>
            <button onClick={() => {
                const init1 = document.querySelector('#initiative-1') as HTMLInputElement;
                const init2 = document.querySelector('#initiative-2') as HTMLInputElement;
                init1.value = "99";
                init2.value = "99"
                data?.socket.sendJsonMessage({ type: 0, id: localStorage.getItem("id"), initiative_ready: true });
            }}>
                Long rest
            </button>
            <div id='initiative-minigame'>
                <h1>RESERVED FOR LATER</h1>
            </div>
            { data?.user.userData.every(u => u.initiativeReady) && <div id="start-btn" onClick={() => {
                data?.socket.sendJsonMessage({type: 1, page: Pages.MONSTER_DRAW})
            }}>
                <BiSolidRightArrow />
            </div> }
        </div>
    )
}