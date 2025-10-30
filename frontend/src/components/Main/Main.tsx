import useWebSocket, { ReadyState } from 'react-use-websocket'
import './Main.css'
import { useEffect } from 'react'
import ConnectionPage from '../Connection/Connection.js'
import WebSocketProvider from '../WebSocketProvider/WebSocketProvider.js'

function Main() {
  return (
    <>
      <WebSocketProvider>
        <ConnectionPage />
      </WebSocketProvider>
    </>
  )
}

export default Main
