import json
import io
from os import read

from .user_data import *

class Database:
    def __init__(self, name: str):
        self.file_name = name + ".json"
        open(self.file_name, 'r').close()
    
    def __read(self):
        file = open(self.file_name, 'r')
        data = file.read()
        file.close()
        return data
    
    def __write(self, data):
        file = open(self.file_name, 'w')
        file.write(data)
        file.close()

    def __append(self, data):
        file = open(self.file_name, 'a')
        file.write(data)
        file.close()
    
    def __load_data(self) -> list[UserData]:
        data = []
        for i in json.loads(self.__read()):
            data.append(UserData(**i))
        return data
    
    def __write_data(self, data: list[UserData]):
        out = "[\n"
        for i in data:
            out += i.toJSON() + (',' if data[-1] != i else '')
        out += "\n]"
        self.__write(out)
    
    def create(self, user: UserData):
        if self.read(user.id) != None:
            return
        data: list[UserData] = self.__load_data()
        if (user.id == -1):
            i = 0
            while self.read(i) != None:
                i += 1
            user.id = i
        data.append(user)
        self.__write_data(data)
        return user.id

    def read(self, id):
        data: list[UserData] = self.__load_data()
        for i in data:
            if i["id"] == id:
                return i
        return None
    
    def read_all(self) -> list[UserData]:
        return self.__load_data()
    
    def read_all_json(self, online = True) -> list[object]:
        data = self.read_all()
        out = []
        idk = {}
        for i in data:
            if not online or i.connected:
                out.append({"id": i.id, "name": i.name, "color": i.color, "pattern": i.pattern})
        return out
    
    def update(self, id, key, value):
        data: list[UserData] = self.__load_data()
        for i in data:
            if i["id"] == id:
                i[key] = value
        self.__write_data(data)
    
    def delete(self, id):
        self.__write_data([d for d in self.__load_data() if d["id"] != id])


