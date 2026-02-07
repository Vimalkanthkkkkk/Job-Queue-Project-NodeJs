import { Worker } from 'node:worker_threads';
import { EventEmitter } from 'events';
import { getJob, moveToDeadQueue } from './queue.js';

export class WorkerPool extends EventEmitter {
  constructor(size) {
    super();
    this.size = size;
    this.workers = [];
    this.freeWorkers = [];

    for (let i = 0; i < size; i++) this.createWorker();
    this.start();
  }

  createWorker() {
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    worker.busy = false;

    worker.on('message', async (msg) => {
      worker.busy = false;
      this.freeWorkers.push(worker);

      if (!msg.success) {
        await moveToDeadQueue(msg);
      }

      this.emit('free');
    });

    this.workers.push(worker);
    this.freeWorkers.push(worker);
  }

  async start() {
    while (true) {
      if (this.freeWorkers.length === 0) {
        await new Promise(r => this.once('free', r));
        continue;
      }

      const jobData = await getJob(); // BRPOP
      const job = JSON.parse(jobData.element);

      const worker = this.freeWorkers.pop();
      worker.busy = true;
      worker.postMessage(job);
    }
  }
}
