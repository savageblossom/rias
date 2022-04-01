const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./helpers/formatDate')
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require('./helpers/userHelper');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Указать папку для статичных файлов (html, js) для рендеринга
app.use(express.static(path.join(__dirname, 'public')));

// Выполнить во время коннекта пользователя
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = newUser(socket.id, username, room);

    socket.join(user.room);

    // Приветствие
    socket.emit('message', formatMessage("РИАС lab#1 - чат", 'Сообщения ограничены этой комнатой! '));

    // Broadcast всем пользователям в чате отправленное сообщение
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage("РИАС lab#1 - чат", `${user.username} присоединился к комнате`)
      );

    // Отобразить юзеров в текущей комнате
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });
  });

  // "Слушать" входящие сообщения
  socket.on('chatMessage', msg => {
    const user = getActiveUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Выполнить во время дисконнекта пользователя
  socket.on('disconnect', () => {
    const user = exitRoom(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage("РИАС lab#1 - чат", `${user.username} покинул комнату`)
      );

      // Отобразить юзеров в текущей комнате
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`${PORT}`));