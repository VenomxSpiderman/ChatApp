const users = {};

function setUser(socketId, username) {
  users[socketId] = username;
}

function getUser(socketId) {
  return users[socketId];
}

function removeUser(socketId) {
  delete users[socketId];
}

function getAllUsers() {
  return Object.values(users);
}

function findSocketIdByUsername(username) {
  return Object.keys(users).find((id) => users[id] === username);
}

function getUsersInRoom(io, room) {
  const socketIds = io.sockets.adapter.rooms.get(room) || new Set();
  return new Set([...socketIds].map((id) => users[id]).filter(Boolean));
}

module.exports = {
  setUser,
  getUser,
  removeUser,
  getAllUsers,
  findSocketIdByUsername,
  getUsersInRoom
};
