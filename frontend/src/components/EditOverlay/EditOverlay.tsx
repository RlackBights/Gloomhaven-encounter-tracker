import { IoIosClose } from 'react-icons/io'
import './EditOverlay.css'
import { useEffect, useState, type ChangeEvent } from 'react';
import { useWebSocketContext } from '../WebSocketProvider/WebSocketContext.js';
import type { UserData } from '../WebSocketProvider/UserData.js';

export default function EditOverlay({ editorOpen, setEditorOpen, currUser, setCurrUser, index }: { editorOpen: boolean, setEditorOpen: React.Dispatch<React.SetStateAction<boolean>>, currUser : UserData, setCurrUser: Function, index: number })
{
    const data = useWebSocketContext();

    // useEffect(() => {
    //     if (!localStorage.getItem("id"))
    //         setEditorOpen(false)
    // })

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
                <input type="color" name="color" id="" value={currUser.color} style={{ backgroundColor: currUser.color }} onChange={(e: ChangeEvent) => {
                    const color = (e.target as HTMLInputElement).value;
                    data?.user.setUserData((users: UserData[]) => {
                        let new_users = [...users];
                        new_users[index]!.color = color;
                        return new_users;
                    });
                    
                }}/>
            </div>
            <button type='submit' onClick={() => {
                data?.socket.sendJsonMessage({type: 0, id: currUser.id, name: currUser.name, color: currUser.color});
                setEditorOpen(false);
            }}>Save</button>
        </form>
    )
}