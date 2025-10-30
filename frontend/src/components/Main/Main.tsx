import useWebSocket, { ReadyState } from 'react-use-websocket'
import './Main.css'
import { useEffect } from 'react'
import ConnectionPage from '../Connection/Connection.js'
import WebSocketProvider from '../WebSocketProvider/WebSocketProvider.js'
import EditOverlay from '../EditOverlay/EditOverlay.js'

function Main() {
  return (
    <>
      <WebSocketProvider>
        <EditOverlay />
        <ConnectionPage />
      </WebSocketProvider>
    </>
  )
}

export default Main
