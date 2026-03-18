const { getUsersInRoom, getAllUsers } = require('./userStore');

const mentionCounts = {};
const alerted = {};
const TROLL_THRESHOLD = 5;

const soothingMessages = [
  (name) => `Let's take a breath - ${name} is a valued member here. Keep things kind!`,
  (name) => `Mentioning ${name} repeatedly can feel overwhelming. Stay positive!`,
  (name) => `${name} is being talked about a lot. Words matter - let's keep this space welcoming.`
];

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkTrolling(io, room, message, senderName) {
  if (!mentionCounts[room]) {
    mentionCounts[room] = {};
  }

  if (!alerted[room]) {
    alerted[room] = new Set();
  }

  const lowerMessage = message.toLowerCase();
  const roomUsers = getUsersInRoom(io, room);

  getAllUsers().forEach((name) => {
    if (name === senderName || !roomUsers.has(name)) {
      return;
    }

    const pattern = new RegExp(`\\b${escapeForRegex(name.toLowerCase())}\\b`);
    if (!pattern.test(lowerMessage)) {
      return;
    }

    mentionCounts[room][name] = (mentionCounts[room][name] || 0) + 1;

    if (mentionCounts[room][name] >= TROLL_THRESHOLD && !alerted[room].has(name)) {
      alerted[room].add(name);
      const msg = soothingMessages[Math.floor(Math.random() * soothingMessages.length)](name);
      io.to(room).emit('system_message', msg);
    }
  });
}

module.exports = { checkTrolling };
