const users = [];

// Присоединиться пользователю в чат
function newUser(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Получить текущего пользователя
function getActiveUser(id) {
  return users.find(user => user.id === id);
}

// Пользователь покинул чат
function exitRoom(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Получить пользователей из конкретной комнаты
function getIndividualRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  newUser,
  getActiveUser,
  exitRoom,
  getIndividualRoomUsers
};