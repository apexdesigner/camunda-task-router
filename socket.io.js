const { Server } = require('socket.io');
const app = require('./app');
const addAuthenticationToSocketIo = require('./utils/addAuthenticationToSocket');
const setupPostgresAdapter = require('./utils/setupPostgresAdapter');

const debug = require('debug')('task-router:setupSocketIo');

function setupSocketIo(server) {
  io = new Server(server);
  debug('io set');

  setupPostgresAdapter(io);

  addAuthenticationToSocketIo(io);

  io.of('/').adapter.on('create-room', (room) => {
    debug(`room ${room} was created`);
  });

  io.of('/').adapter.on('delete-room', (room) => {
    debug(`room ${room} was deleted`);
  });

  io.of('/').adapter.on('join-room', (room, id) => {
    debug(`socket ${id} has joined room ${room}`);
  });

  io.of('/').adapter.on('leave-room', (room, id) => {
    debug(`socket ${id} has left room ${room}`);
  });

  io.on('connection', async (socket) => {
    debug('on connection socket.id', socket.id);
    debug('on connection socket.nsp.name', socket.nsp.name);

    socket.on('join', async (roomName) => {
      debug(socket.id, 'joining', roomName);
      socket.join(roomName);
      debug('joined');
    });

    socket.on('leave', (roomName) => {
      debug(socket.id, 'leaving', roomName);
      socket.leave(roomName);
      debug('left');
    });

    socket.on('disconnect', () => {
      debug('disconnect socket.id', socket.id);
    });
  });

  io.on('error', (err) => {
    debug('err', err);
  });
  app.set('io', io);
  app.emit('io ready');
}
module.exports = { setupSocketIo };

debug('setup complete');
