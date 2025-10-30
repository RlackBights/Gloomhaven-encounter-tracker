import json
from random import randint

class UserData():
    def __init__(self, id = -1, name = f"User_{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}", color = "#808080", pattern = 0, connected = True):
        self.id = id
        self.name = name
        self.color = color
        self.pattern = pattern
        self.connected = connected

    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)
    
    def __getitem__(self, key):
        return getattr(self, key)
    
    def __setitem__(self, key, value):
        setattr(self, key, value)