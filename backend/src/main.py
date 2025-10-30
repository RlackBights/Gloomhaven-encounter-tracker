from random import randint
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['localhost'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[WebSocket, PlayerData] = {}
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        if websocket in self.active_connections.keys():
            return
        
        name = websocket.query_params.get("name")
        if name and name != "null":
            self.active_connections[websocket] = PlayerData(name)
        else:
            self.active_connections[websocket] = PlayerData()
            await websocket.send_json({"type": 0, "name": self.active_connections[websocket].name})
        await self.broadcast({"type": 1, "num": len(self.active_connections)})
    
    async def disconnect(self, websocket: WebSocket):
        name = ""
        for i in self.active_connections.keys():
            if (i != websocket):
                continue

            print("disconnected")
            name = self.active_connections[websocket].name
            self.active_connections.pop(websocket, None)
            break
        await self.broadcast({"type": 2, "num": len(self.active_connections), "name": name})
    
    async def broadcast(self, message, exclude=[]):
        for connection in self.active_connections.keys():
            if connection not in exclude:
                await connection.send_json(message)

    async def send_text(self, websocket: WebSocket, message):
        await websocket.send_json(message)

class PlayerData:
    def __init__(self, name: str = ""):
        self.name: str = f"User_{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}" if name == "" else name

manager = ConnectionManager()

@app.websocket("/api")
async def websocket_connection(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
