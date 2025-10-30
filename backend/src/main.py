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
        color = websocket.query_params.get("color")
        print(color)
        if name and name != "null":
            self.active_connections[websocket] = PlayerData(name)
        else:
            self.active_connections[websocket] = PlayerData()

        if color and color != "undefined":
            self.active_connections[websocket].color = "#" + color

        await websocket.send_json({"type": 0, "name": self.active_connections[websocket].name, "color": self.active_connections[websocket].color})
        for s in self.active_connections.keys():
            await self.send_text(s, {"type": 1, "num": len(self.active_connections), "others": list(filter(lambda n: n != self.active_connections[s].name, list(p.name for p in self.active_connections.values()))), "otherColors": list(p.color for p in filter(lambda n: n.name != self.active_connections[s].name, list(p for p in self.active_connections.values())))})
    
    async def disconnect(self, websocket: WebSocket):
        name = ""
        for i in self.active_connections.keys():
            if (i != websocket):
                continue

            print("disconnected")
            name = self.active_connections[websocket].name
            self.active_connections.pop(websocket, None)
            break
        for s in self.active_connections.keys():
            await self.send_text(s, {"type": 2, "num": len(self.active_connections), "name": name, "others": list(filter(lambda n: n != self.active_connections[s].name, list(p.name for p in self.active_connections.values())))})
    
    async def broadcast(self, message, exclude=[]):
        for connection in self.active_connections.keys():
            if connection not in exclude:
                await connection.send_json(message)

    async def send_text(self, websocket: WebSocket, message):
        await websocket.send_json(message)

    async def process_message(self, websocket: WebSocket, message):
        match (message["type"]):
            case (0):
                self.active_connections[websocket].name = message["name"]
                self.active_connections[websocket].color = message["color"]
            case (_):
                pass

class PlayerData:
    def __init__(self, name: str = f"User_{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}", color: str = "#808080"):
        self.name: str = name
        self.color: str = color

manager = ConnectionManager()

@app.websocket("/api")
async def websocket_connection(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
            await manager.process_message(websocket, data)
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
