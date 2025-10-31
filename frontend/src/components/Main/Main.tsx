import useWebSocket, { ReadyState } from 'react-use-websocket'
import './Main.css'
import { useEffect, useState } from 'react'
import ConnectionPage from '../Connection/Connection.js'
import WebSocketProvider from '../WebSocketProvider/WebSocketProvider.js'
import EditOverlay from '../EditOverlay/EditOverlay.js'
import { PageContext } from './PageContext.js'
import InitiativePage from '../InitiativePage/InitiativePage.js'
import Pages from './Pages.js'
import MonsterDrawPage from '../MonsterDrawPage/MonsterDrawPage.js'

function Main() {

  const [currentPage, setCurrentPage] = useState<Pages | null>(null);
  if (!localStorage.getItem("id")) localStorage.setItem("id", "-1")

  useEffect(() => {
    sessionStorage.setItem("force_page_load", "true");
  }, [])

  useEffect(() => {
    if (currentPage === null) return;
    
    const initiative = document.querySelector("#initiative-container")! as HTMLElement;
    const connection = document.querySelector("#connection-container")! as HTMLElement;
    const monsterDraw = document.querySelector("#monster-draw-container")! as HTMLElement;
    
    initiative.style.display = "none";
    connection.style.display = "none";
    monsterDraw.style.display = "none";

    if (sessionStorage.getItem("force_page_load") == "true") {
      switch (currentPage) {
        case Pages.CONNECTION:
          connection.style.display = "";
          break;
        case Pages.INITIATIVE:
          initiative.style.display = "";
          break;
        case Pages.MONSTER_DRAW:
          monsterDraw.style.display = "";
        default:
          break;
      }
      sessionStorage.setItem("force_page_load", "false");
      return;
    }

    switch (currentPage) {
      case Pages.CONNECTION:
        connection.style.display = "";
        connection.animate({
          transform: ["translateY(50%)", "translateY(0)"],
          opacity: [0, 1],
          easing: ["ease-in-out"]
        }, 750)
        break;
      case Pages.INITIATIVE:
        connection.style.display = "";
        initiative.style.display = "";
        initiative.animate({
          transform: ["translateX(100%)", "translateX(0)"],
          opacity: [0, 1],
          easing: ["ease-in-out"]
        }, 750)
        connection.animate({
          transform: ["translateX(0)", "translateX(-100%)"],
          opacity: [1, 0],
          easing: ["ease-in-out"]
        }, 750).addEventListener("finish", () => {
          connection.style.display = "none";
        })
        break;
      case Pages.MONSTER_DRAW:
        initiative.style.display = "";
        monsterDraw.style.display = "";
        monsterDraw.animate({
          transform: ["translateX(100%)", "translateX(0)"],
          opacity: [0, 1],
          easing: ["ease-in-out"]
        }, 750)
        initiative.animate({
          transform: ["translateX(0)", "translateX(-100%)"],
          opacity: [1, 0],
          easing: ["ease-in-out"]
        }, 750).addEventListener("finish", () => {
          initiative.style.display = "none";
        })
        break;
      default:
        break;
    }

    sessionStorage.setItem("force_page_load", "false");
  }, [currentPage]);

  return (
    <>
      <PageContext.Provider value={{currentPage, setCurrentPage}}>
        <WebSocketProvider>
          <ConnectionPage />
          <InitiativePage />
          <MonsterDrawPage />
        </WebSocketProvider>
      </PageContext.Provider>
    </>
  )
}

export default Main
