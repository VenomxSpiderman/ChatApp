const {
  setUser,
  getUser,
  removeUser,
  getAllUsers,
  findSocketIdByUsername
} = require('../services/userStore');

function loginUser(socket, username) {
  setUser(socket.id, username);
  socket.username = username;
  socket.currentRoom = 'general';
}

function disconnectUser(socket) {
  if (!socket.username) {
    return;
  }

  removeUser(socket.id);
}

module.exports = {
  loginUser,
  disconnectUser,
  getAllUsers,
  getUser,
  findSocketIdByUsername
};
