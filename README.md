# Real-Time Chat App

A real-time chat application built with Node.js, Express, Socket.IO, and MongoDB Atlas.

This project was created as part of Assignment 3 of Internet Technologies Lab, Jadavpur University, BCSE3, Batch of 2027.

Live app: https://chatapp-290j.onrender.com/

## Key features

- User login with custom username
- Online users list
- Multi-room chat support
- Private messaging with /msg
- Message persistence in MongoDB Atlas
- Room history retrieval
- OTP-like number warning before send
- Image message support

## Additional behavior

- Real-time updates using Socket.IO
- Room list updates for all connected users
- Message history is fetched when users join a room
- Basic anti-trolling alert based on repeated mentions

## Tech stack

- Node.js
- Express
- Socket.IO
- MongoDB Atlas with Mongoose
- Pug template engine

## Quick start

1. Install dependencies.

```bash
npm install
```

2. Create a .env file in the project root.

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/Assignment3?retryWrites=true&w=majority
PORT=3000
```

3. Start the app.

```bash
npm start
```

4. Open: http://localhost:3000

## MongoDB Atlas setup

1. Create a cluster in Atlas.
2. Create a database user with read and write access.
3. In Network Access, allow your IP for local testing.
4. Copy the Atlas connection string.
5. Replace the username, password, and cluster URL in MONGODB_URI.
6. Keep Assignment3 as the database name in the URI.

## Chat commands

- Join room: /join roomName
- Private message: /msg username your message

## Other versions

- [Variation 1](https://drive.google.com/drive/folders/1z7YnC9lpgwUx9EeBNms2iI0YcqUQMTfF?usp=share_link): Uses Redis sets, hashes, and lists for rooms, passwords, and last 50 messages.
- [Variation 2](https://drive.google.com/drive/folders/1l3QNf34FAw38r99GesilbGdWT-acYdCw?usp=sharing): Uses Redis sorted set for room ordering and auto-removes older rooms when limit is crossed.

## Directory Structure

```text
.
|- config/
|  |- database.js
|- controllers/
|  |- messageController.js
|  |- roomController.js
|  |- userController.js
|- middlewares/
|- models/
|  |- message.js
|  |- room.js
|- routes/
|  |- index.js
|- services/
|  |- messageValidator.js
|  |- trollingDetector.js
|  |- userStore.js
|- sockets/
|  |- registerHandlers.js
|- views/
|  |- client.pug
|- .env.example
|- package.json
|- server.js
```

## System Design Principles Used

- Separation of concerns: models, controllers, services, routes, and sockets are kept separate.
- Modular structure: each part of the app has its own file/folder with a single clear responsibility.
- Event-driven design: Socket.IO events are handled through centralized registration.
- Environment-based configuration: sensitive values are read from .env.
- Data persistence with bounded history: room messages are stored and fetched with limits for predictable performance.
- Simple scalability path: architecture supports moving to alternate stores (for example Redis variations) with minimal UI changes.