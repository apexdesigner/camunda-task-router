const app = require('./app');

const ZBClient = require('zeebe-node').ZBClient;
const debug = require('debug')('task-router:zeebeClient');

if (!process.env.ZEEBE_ADDRESS)
  throw `At least the "ZEEBE_ADDRESS" environment variable is required. See https://github.com/camunda-community-hub/zeebe-client-node-js#zero-conf-constructor for more details.`;

const newZeebeClient = new ZBClient();
debug('created newZeebeClient');

async function getTopology() {
  const topology = await newZeebeClient.topology();
  debug('topology %j', topology);

  app.set('zeebeClient', newZeebeClient);
  app.emit('zeebeClient ready');
}

getTopology();
