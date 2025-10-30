import { IoIosClose } from 'react-icons/io'
import './EditOverlay.css'
import { useEffect, useState, type ChangeEvent } from 'react';
import { useWebSocketContext } from '../WebSocketProvider/WebSocketContext.js';
import type { UserData } from '../WebSocketProvider/UserData.js';

export default function EditOverlay()
{
    const data = useWebSocketContext();

    useEffect(() => {
        if (!localStorage.getItem("name"))
            data?.user?.setUserData((u: UserData) => ({...u, isEditorOpen: false }))
    })

    return (
        data?.user?.userData?.isEditorOpen && <form id="edit-overlay" onSubmit={(e) => {e.preventDefault()}}>
            <IoIosClose onClick={() => {
                data?.user?.setUserData((u: UserData) => ({...u, isEditorOpen: false }))
            }}/>
            <input type="text" name="name" id="" value={data?.user?.userData?.name} onChange={(e: ChangeEvent) => {
                const name = (e.target as HTMLInputElement).value;
                data?.user?.setUserData((u: UserData) => ({...u, name}));
            }} />
            <input type="color" name="color" id="" value={data.user.userData.color} onChange={(e: ChangeEvent) => {
                const color = (e.target as HTMLInputElement).value;
                data.user?.setUserData((u: UserData) => ({...u, color}));
                
            }}/>
            <button type='submit' onClick={() => {
                data.socket.sendJsonMessage({type: 0, name: data?.user?.userData?.name, color: data.user?.userData?.color});
                localStorage.setItem("name", data?.user?.userData?.name!);
                localStorage.setItem("color", data?.user?.userData?.color!);
                data?.user?.setUserData((u: UserData) => ({...u, isEditorOpen: false }))
            }}>Save</button>
        </form>
    )
}