const debug = require('debug')('task-router:handleUserTasks');
const Duration = require('zeebe-node').Duration;
const app = require('../app');

async function handleUserTasks() {
  debug('getting zeebeClient');
  const zeebeClient = app.get('zeebeClient');
  debug('got zeebeClient');

  const io = app.get('io');

  const userTaskWorker = zeebeClient.createWorker({
    taskType: 'io.camunda.zeebe:userTask',
    timeout: Duration.days.of(process.env.workerTimeout || 365),

    taskHandler: async (job, deprecated, worker) => {
      debug('job %j', job);

      let rooms = io.to('BPMN Process Id ' + job.bpmnProcessId);

      rooms.emit('User Task Created', job);
      debug('emitted');

      const forwardResult = await job.forward();
      debug('forwardResult %j', forwardResult);
    },
  });
  debug('userTaskWorker %j', userTaskWorker);
}
module.exports = handleUserTasks;
