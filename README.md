# Real-Time Chat App

A simple chat app built with Node.js, Express, Socket.IO, and MongoDB Atlas.

## Key features

- Lets users join with a username
- Shows online users
- Supports multiple rooms
- Supports private messages with `/msg`
- Saves room messages in MongoDB
- Shows previous room history
- Warns before sending possible OTP-like numbers
- Supports image messages

## Extra behavior built in

- Real-time updates using Socket.IO
- Room list updates for all connected users
- Message history is fetched when users join a room
- Basic anti-trolling alert based on repeated mentions

## Tech stack

- Node.js
- Express
- Socket.IO
- MongoDB Atlas with Mongoose
- Pug (template view)

## Project structure

- `server.js` -> app entry point
- `config/` -> database setup
- `models/` -> MongoDB models
- `controllers/` -> app logic
- `services/` -> helper logic
- `sockets/` -> Socket.IO event handlers
- `routes/` -> web routes
- `views/` -> frontend template

## Prerequisites

- Node.js 18 or above
- A MongoDB Atlas cluster and user


## Run locally

1. Install packages:

```bash
npm i
```

2. Start server:

```bash
npm start
```

3. Open in browser:

```text
http://localhost:3000
```

## Commands in chat

- Join room: `/join roomName`
- Private message: `/msg username your message`
