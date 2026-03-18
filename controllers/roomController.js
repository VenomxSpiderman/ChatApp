const Room = require('../models/room');

async function ensureRoom(name) {
  await Room.findOneAndUpdate({ name }, { name }, { upsert: true });
  const rooms = await Room.find().lean();
  return rooms.map((room) => room.name);
}

async function listRooms() {
  const rooms = await Room.find().lean();
  return rooms.map((room) => room.name);
}

module.exports = { ensureRoom, listRooms };
