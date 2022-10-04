const app = require('../app');
const { Emitter } = require('@socket.io/postgres-emitter');
const { createAdapter } = require('@socket.io/postgres-adapter');
const { Pool } = require('pg');

const debug = require('debug')('task-router:setupPostgresAdapter');

function setupPostgresAdapter(io) {
  debug('setting up postgres adapter');

  const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
  });

  pool.query(`
  CREATE TABLE IF NOT EXISTS socket_io_attachments (
      id          bigserial UNIQUE,
      created_at  timestamptz DEFAULT NOW(),
      payload     bytea
  );
`);

  const emitter = new Emitter(pool);
  app.set('socketIoEmitter', emitter);

  io.adapter(createAdapter(pool));
}
module.exports = setupPostgresAdapter;
