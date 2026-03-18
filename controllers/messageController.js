const Message = require('../models/message');

async function getRoomHistory(room, limit = 50) {
  return Message.find({ room }).sort({ timestamp: 1 }).limit(limit).lean();
}

async function createTextMessage(room, user, message) {
  return Message.create({ room, user, message });
}

module.exports = { getRoomHistory, createTextMessage };
