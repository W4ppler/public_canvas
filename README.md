# //public:canvas
This project was created in contribution to the [summer of making](https://summer.hackclub.com). It was planned to result in a Website that offers ppl to draw on a canvas together (like r/place). 

## Used tech
- Django 5.2.6
- Angular 20.1.0
- Tailwind 4.1.11

## How it works
### Frontend
The core of the frontend is the canvas component. This component firstly calls the API to retrieve the intial canvas state. This only happens when the site is opened. After that a websocket connection is used to send and retrieve live updates when users draw. The canvas tag's width is 1000x500 pixel. The user can choose their prefered colour and width (1 - 10px) for their brush. 

### Backend
The Django backend offers the previously mentioned api endpoint for the intial canvas retrievment. It also handles the websocket connections and updates the db accordingly. Redis is used to distribute the data to the different users. PostgreSQL is used as the database. The only Django model I had to create was the Pixels table 

## Requirements
- Docker

## Instalation and Usage 
1. Clone the repo
```
git clone https://github.com/W4ppler/public_canvas.git
```
2. Change Directory
```
cd public_canvas
```
3. Start the containers
```
docker compose up -d --build
```
You can use docker compose down in the same directory to stop the containers

### .env File
There is an example .env file in the root directory. You should change the values. The default values should work fine for local usage.

## Todo
- Optimize the websocket connection, currently the room is overcapacitated pretty quicly
