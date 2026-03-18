const { ensureRoom, listRooms } = require('../controllers/roomController');
const { getRoomHistory, createTextMessage } = require('../controllers/messageController');
const {
  loginUser,
  disconnectUser,
  getAllUsers,
  findSocketIdByUsername
} = require('../controllers/userController');
const { hasOtp } = require('../services/messageValidator');
const { checkTrolling } = require('../services/trollingDetector');

function registerHandlers(io) {
  io.on('connection', (socket) => {
    listRooms()
      .then((rooms) => socket.emit('room_list', rooms))
      .catch(() => {
        socket.emit('system_message', 'Unable to load rooms right now.');
      });

    socket.on('login', async (username) => {
      try {
        const normalizedName = typeof username === 'string' ? username.trim() : '';
        if (!normalizedName) {
          socket.emit('system_message', 'Username is required.');
          return;
        }

        loginUser(socket, normalizedName);

        const rooms = await ensureRoom('general');
        io.emit('room_list', rooms);

        socket.join('general');

        const history = await getRoomHistory('general');
        socket.emit('room_history', { room: 'general', messages: history });
        socket.emit('system_message', `Welcome ${normalizedName}! You are in room: general`);
        socket.to('general').emit('system_message', `${normalizedName} joined the chat.`);
        io.emit('update_users', getAllUsers());
      } catch (error) {
        socket.emit('system_message', 'Login failed. Please try again.');
      }
    });

    socket.on('chat_message', async ({ message, type, isConfirmed }) => {
      try {
        if (!socket.username || !socket.currentRoom) {
          socket.emit('system_message', 'Please login before sending messages.');
          return;
        }

        const normalizedType = type === 'image' ? 'image' : 'text';
        const normalizedMessage = typeof message === 'string' ? message.trim() : '';

        if (!normalizedMessage) {
          return;
        }

        if (normalizedType === 'text' && normalizedMessage.startsWith('/msg ')) {
          const parts = normalizedMessage.split(' ');
          if (parts.length >= 3) {
            const targetUser = parts[1];
            const privateMsg = parts.slice(2).join(' ').trim();
            const targetId = findSocketIdByUsername(targetUser);

            if (!privateMsg) {
              return;
            }

            if (targetId) {
              io.to(targetId).emit('chat_message', {
                user: `(Private) ${socket.username}`,
                message: privateMsg,
                type: 'text',
                isPrivate: true
              });
              socket.emit('chat_message', {
                user: `(To ${targetUser})`,
                message: privateMsg,
                type: 'text',
                isPrivate: true
              });
            } else {
              socket.emit('system_message', `User "${targetUser}" not found.`);
            }
          }
          return;
        }

        if (normalizedType === 'text' && normalizedMessage.startsWith('/join ')) {
          const newRoom = normalizedMessage.split(' ')[1]?.trim();
          if (!newRoom) {
            return;
          }

          const previousRoom = socket.currentRoom;
          if (previousRoom) {
            socket.leave(previousRoom);
            socket.to(previousRoom).emit('system_message', `${socket.username} left the room.`);
          }

          const rooms = await ensureRoom(newRoom);
          io.emit('room_list', rooms);

          socket.join(newRoom);
          socket.currentRoom = newRoom;

          const history = await getRoomHistory(newRoom);
          socket.emit('room_history', { room: newRoom, messages: history });
          socket.emit('system_message', `You joined room: ${newRoom}`);
          socket.to(newRoom).emit('system_message', `${socket.username} joined the room.`);
          return;
        }

        if (normalizedType === 'text' && hasOtp(normalizedMessage) && !isConfirmed) {
          socket.emit('otp_warning', {
            originalMessage: normalizedMessage,
            warning: 'Your message may contain an OTP. Send anyway?'
          });
          return;
        }

        io.to(socket.currentRoom).emit('chat_message', {
          user: socket.username,
          message: normalizedMessage,
          type: normalizedType
        });

        if (normalizedType === 'text') {
          await createTextMessage(socket.currentRoom, socket.username, normalizedMessage);
          checkTrolling(io, socket.currentRoom, normalizedMessage, socket.username);
        }
      } catch (error) {
        socket.emit('system_message', 'Message could not be processed. Please try again.');
      }
    });

    socket.on('view_history', async (roomName) => {
      try {
        if (!socket.username) {
          return;
        }

        const normalizedRoom = typeof roomName === 'string' ? roomName.trim() : '';
        if (!normalizedRoom) {
          return;
        }

        const history = await getRoomHistory(normalizedRoom);
        socket.emit('history_peek', { room: normalizedRoom, messages: history });
        io.to(normalizedRoom).emit('system_message', `${socket.username} viewed history of #${normalizedRoom}`);
      } catch (error) {
        socket.emit('system_message', 'History could not be loaded right now.');
      }
    });

    socket.on('disconnect', () => {
      if (!socket.username) {
        return;
      }

      disconnectUser(socket);
      io.emit('update_users', getAllUsers());
      io.to(socket.currentRoom).emit('system_message', `${socket.username} disconnected.`);
    });
  });
}

module.exports = { registerHandlers };