import { parentPort } from 'node:worker_threads';
import { retry } from './retry.js';

parentPort.on('message', async (job) => {
  try {
    const result = await retry(async () => {
      // simulate_task
      if (Math.random() < 0.3) throw new Error("Random failure");
      return `Processed: ${job}`;
    }, 4);

    parentPort.postMessage({ success: true, result });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
});