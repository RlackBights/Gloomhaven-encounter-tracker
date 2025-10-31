import { IoIosClose } from 'react-icons/io'
import './EditOverlay.css'
import { useEffect, useState, type ChangeEvent } from 'react';
import { useWebSocketContext } from '../WebSocketProvider/WebSocketContext.js';
import type { UserData } from '../WebSocketProvider/UserData.js';
import { BiLeftArrow, BiLeftArrowAlt, BiLeftArrowCircle, BiRightArrow, BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';
import BackgroundPattern from '../WebSocketProvider/BackgroundPattern.js';
import Patterns from '../../assets/index.js';
import { betterMod } from '../Tools/Tools.js';

export default function EditOverlay({ setEditorOpen, currUser, index }: { setEditorOpen: React.Dispatch<React.SetStateAction<boolean>>, currUser : UserData, index: number })
{
    const data = useWebSocketContext();

    const [isChangeCooldown, setIsChangeCooldown] = useState<boolean>(false);

    useEffect(() => {
        if (!isChangeCooldown)
        {
            setIsChangeCooldown(true)
            setTimeout(() => {
                setIsChangeCooldown(false)
            }, 50);
            data?.socket.sendJsonMessage({type: 0, id: currUser.id, name: currUser.name, color: currUser.color, pattern: currUser.pattern});
        }
        
    }, [data?.user.userData])

    return (
        <form id="edit-overlay" onSubmit={(e) => {e.preventDefault()}}>
            <IoIosClose onClick={() => {
                setEditorOpen(false)
            }}/>
            <div>
                <input type="text" name="name" id="" value={currUser.name} onChange={(e: ChangeEvent) => {
                    const name = (e.target as HTMLInputElement).value;
                    data?.user.setUserData((users: UserData[]) => {
                        let new_users = [...users];
                        new_users[index]!.name = name;
                        return new_users;
                    });
                }} />
                <BiSolidLeftArrow onClick={() => {
                    data?.user.setUserData((users: UserData[]) => {
                        let new_users = [...users];                        
                        new_users[index]!.pattern = betterMod((new_users[index]!.pattern - 1), (Object.keys(BackgroundPattern).length / 2));
                        return new_users;
                    });
                }} />
                <input type="color" name="color" id="" value={currUser.color} style={{ backgroundColor: currUser.color, backgroundImage: `url("${Patterns[currUser.pattern]}")` }} onChange={(e: ChangeEvent) => {
                    const color = (e.target as HTMLInputElement).value;
                    data?.user.setUserData((users: UserData[]) => {
                        let new_users = [...users];
                        new_users[index]!.color = color;
                        return new_users;
                    });
                }}/>
                <BiSolidRightArrow onClick={() => {
                    data?.user.setUserData((users: UserData[]) => {
                        let new_users = [...users];                        
                        new_users[index]!.pattern = betterMod((new_users[index]!.pattern + 1), (Object.keys(BackgroundPattern).length / 2));
                        return new_users;
                    });
                }} />
            </div>
            <button type='submit' onClick={() => {
                data?.socket.sendJsonMessage({type: 0, id: currUser.id, name: currUser.name, color: currUser.color, pattern: currUser.pattern});
                setEditorOpen(false);
            }}>Done</button>
        </form>
    )
}