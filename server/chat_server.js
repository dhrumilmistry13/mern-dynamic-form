const dotenv = require('dotenv');

const fs = require('fs');

dotenv.config({ path: '.env' });
const PORT = process.env.CHAT_PORT || 3002;

let users = [];
// const adminSocket = [];
const privateKey = fs.readFileSync('privateKey.pem');
const certificate = fs.readFileSync('certificate.pem');

const server = require('https').createServer({
  key: privateKey,
  cert: certificate,
});
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const { sendEmailOfflineUser } = require('./helpers/email.helper');

io.on('connection', (socket) => {
  socket.on('user_connected', (user) => {
    socket.join(socket.id);
    const data = {
      socket_id: socket.id,
      user_id: user.from_user_id,
      user_chat_room_id: user.user_chat_room_id,
      is_patient: user.is_patient || 0,
    };
    // console.log(data);
    users.push(data);
    io.emit('updateUserStatus', users);
  });
  socket.on('user_disconnect', (user) => {
    if (user) {
      users = users.filter((v) => v.user_id !== user.user_id);
    } else {
      users = users.filter((v) => v.socket_id !== socket.id);
    }
    io.emit('updateUserStatus', users);
    socket.leave(socket.id);
  });
  socket.on('disconnect', (data) => {
    console.log(data);
    if (data) {
      users = users.filter((v) => v.user_id !== data.user_id);
    } else {
      users = users.filter((v) => v.socket_id !== socket.id);
    }
    console.log(data, 'disconnect');
    socket.leave(socket.id);
  });
  socket.on('new_message', (data) => {
    console.log(data, 'new_message start');
    if (data.is_patient) {
      users.forEach((user) => {
        if (user.is_patient) {
          socket.broadcast.to(user.socket_id).emit('check_message', data);
          io.sockets.in(user.socket_id).emit('check_message', data);
          socket.broadcast.to(user.socket_id).emit('user_list', data);
          io.sockets.to(user.socket_id).emit('user_list', data);
        }
      });
      const i = users.filter(
        (user) =>
          user !== 0 && user.user_id.toString() === data.to_user_id.toString()
      );
      if (i.length === 0) {
        sendEmailOfflineUser(data, 'user');
      }
    } else {
      users
        .filter(
          (user) =>
            user !== 0 &&
            user.user_id.toString() !== data.from_user_id.toString()
        )
        .forEach((user) => {
          socket.broadcast.to(user.socket_id).emit('check_message', data);
          io.sockets.in(user.socket_id).emit('check_message', data);
          socket.broadcast.to(user.socket_id).emit('user_list', data);
          io.sockets.to(user.socket_id).emit('user_list', data);
        });
      const i = users.filter(
        (user) =>
          user !== 0 && user.user_id.toString() === data.to_user_id.toString()
      );
      if (i.length === 0) {
        sendEmailOfflineUser(data, 'user');
      }
    }
  });
});
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
