require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const { connectDatabase } = require('./config/database');
const indexRoutes = require('./routes');
const { registerHandlers } = require('./sockets/registerHandlers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e8 });

app.set('view engine', 'pug');
app.use('/', indexRoutes);

registerHandlers(io);

const PORT = process.env.PORT || 3000;

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing process or change PORT in .env.`);
    process.exit(1);
  }

  console.error('Server error:', error);
  process.exit(1);
});

connectDatabase(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB error:', error);
    process.exit(1);
  });
