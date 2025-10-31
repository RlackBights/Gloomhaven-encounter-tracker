import json
from random import randint
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocketState
from starlette.responses import MalformedRangeHeader
import asyncio


from .db import *
from .user_data import *

RECONNECT_GRACE_PERIOD = 5
db = Database("GloomHaven")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['localhost'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

connections = []
game_state = 0
disconnect_tasks = {}

for i in db.read_all():
    db.update(i["id"], "connected", False)
    db.update(i["id"], "initiative_ready", False)

async def process_message(websocket: WebSocket, data):
    match (data["type"]):
        case 0: # Update player data
            print(data)
            for i in data:
                if i not in ["type", "id"]:
                    db.update(data["id"], i, data[i])
            pass
        case 1: # Update game state
            if data["page"] != None:
                global game_state
                game_state = data["page"]
            pass
        case (_):
            pass
    await refresh_users()

async def broadcast_message(data):
    for c in connections:
        try:
            await c.send_json(data)
        except Exception as e:
            pass

async def on_player_connect(websocket: WebSocket):
    await websocket.accept()

    # Resolve connection ID
    if websocket not in connections:
        connections.append(websocket)
    connection_id = -1
    param = websocket.query_params.get('id')

    # Instantiate a user
    if param != None and param != "null" and param != "-1":
        connection_id = int(param)
        db.create(UserData(connection_id))
    else:
        connection_id = db.create(UserData())
        await websocket.send_json({"type": 0, "id": connection_id})
    if connection_id != None:
        db.update(connection_id, "connected", True)

    # Remove disconnection task in case of reconnection
    if connection_id in disconnect_tasks.keys():
        disconnect_tasks[connection_id].cancel()
        del disconnect_tasks[connection_id]
    await refresh_users()
    return connection_id

async def refresh_users():
    await broadcast_message({"type": 1, "users": db.read_all_json(), "page": game_state})

@app.websocket("/api")
async def websocket_connection(websocket: WebSocket):
    connection_id = await on_player_connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await process_message(websocket, data)
    except WebSocketDisconnect:
        async def disconnect(connection_id, websocket):
            try:
                print("start disconnect")
                await asyncio.sleep(RECONNECT_GRACE_PERIOD)
                print(connection_id)
                db.update(connection_id, "connected", False)
                connections.remove(websocket)
                await refresh_users()
            except asyncio.CancelledError:
                print("cancelled disconnect")
                await refresh_users()
                
        task = asyncio.create_task(disconnect(connection_id, websocket))
        disconnect_tasks[connection_id] = task

        