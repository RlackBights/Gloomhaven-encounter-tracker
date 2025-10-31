# Gloomhaven Encounter Tracker
yippee
## Idea
A small personal project I'm working on for my friends and I, so we can track monsters more effectively, since managing them by hand is a huge waste of time.

## How to use
NOT COMPLETE YET IM WORKIN ON IT  
but apart from that it's pretty self-explanatory, you'll know if you've played the game  
if not, why are you even here wth  
I'll actually give instructions if and when I'm done with the project  

## How does it work
The current idea is that both the frontend and backend run on the same machine, and the players connect to the hosted frontend on the same network.  
I currently have no resources to have a proper backend server separate from the frontend, or any locally hosting machines, so that's the best for now.  

## Technologies used
For the backend I'm using python mainly with the FastAPI library, using WebSockets for proper real-time communication
For the frontend I'm stuck in an eternal prison of React and TypeScript, but with a twist this time... (I'm using Vite)

## How to install
Clone the repository, and navigate into the project folder<br>
`cd Gloomhaven-encounter-tracker`
### Installing the backend
In the backend folder there's a requirements.txt which contains every python library the venv needs to function
1. Navigate to the backend folder<br>
`cd ./backend/`<br><br>
2. Activate the virtual environment<br>
Windows: `venv\Scripts\activate`<br>
Linux / MacOS: `source venv/bin/activate`<br><br>
3. Install requirements<br>
`pip install -r ./requirements.txt`<br><br>
### Installing the frontend
1. Navigate to the frontend folder<br>
`cd ./frontend/`<br><br>
2. Install the node packages<br>
`npm i`<br><br>
## How to run
1. Navigate to the frontend folder<br>
`cd ./frontend/`<br><br>
2. Simply run the frontend and backend<br>
`npm run dev` - frontend (yes I know, yes it is a dev build, no, I do not really care rn)<br>
`npm run api` - backend (this is also probably a dev build according to FastAPI, refer back to the frontend comment)
