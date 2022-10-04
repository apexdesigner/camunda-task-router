const jwksRsa = require('jwks-rsa');
let socketioJwt = require('socketio-jwt');
const debug = require('debug')('task-router:addAuthenticationToSocket');

function addAuthenticationToSocket(io) {
  const secret = jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.jwksUri || `https://${process.env.issuer}/.well-known/jwks.json`,
  });
  debug('secret', secret);
  debug('process.env.issuer', process.env.issuer);
  debug('process.env.audience', process.env.audience);

  io.use(async (socket, next) => {
    debug('socket connecting %j', socket);
    next();
  });

  io.use(async (socket, next) => {
    debug('socket.decoded_token1 %j', socket.decoded_token);

    next();
  });

  io.use(
    socketioJwt.authorize({
      secret: secret,
      handshake: true,
      //auth_header_required: true,
      //audience: process.env.audience,
      //issuer: process.env.issuer,
      //algorithms: process.env.algorithms || ['RS256'],
    })
  );

  io.use(async (socket, next) => {
    debug('socket.decoded_token %j', socket.decoded_token);
    setTimeout(() => {
      console.log('setn data?');
      io.emit('data', 'some data');
    }, 2000);

    next();
  });
  debug('middleware set');
}
module.exports = addAuthenticationToSocket;
