import json
from random import randint
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocketState
from starlette.responses import MalformedRangeHeader

from .db import *
from .user_data import *

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

async def process_message(websocket: WebSocket, data):
    match (data["type"]):
        case (0):
            db.update(data["id"], "name", data["name"])
            db.update(data["id"], "color", data["color"])
            pass
        case (_):
            pass
    await refresh_users()

async def broadcast_message(data):
    for c in connections:
        await c.send_json(data)

async def refresh_users():
    await broadcast_message({"type": 1, "users": db.read_all_json()})

@app.websocket("/api")
async def websocket_connection(websocket: WebSocket):
    await websocket.accept()
    if websocket not in connections:
        connections.append(websocket)
    connection_id = -1
    param = websocket.query_params.get('id')
    if param != None and param != "null":
        connection_id = int(param)
        db.create(UserData(connection_id))
    else:
        connection_id = db.create(UserData())
        await websocket.send_json({"type": 0, "id": connection_id})
    db.update(connection_id, "connected", True)
    await refresh_users()
    try:
        while True:
            data = await websocket.receive_json()
            await process_message(websocket, data)
    except WebSocketDisconnect:
        db.update(connection_id, "connected", False)
        connections.remove(websocket)
        await refresh_users()