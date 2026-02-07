import express from 'express';
import os from 'os';
import { addJob, addDelayedJob } from './queue.js';
import { WorkerPool } from './workerPool.js';

const app = express();
app.use(express.json());
new WorkerPool(os.availableParallelism());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/addjob', async (req, res) => {
  await addJob(req.body);
  res.send({ status: 'Job added' });
});

app.post('/addjob/high', async (req, res) => {
  await addJob(req.body, 'high');
  res.send({ status: 'High priority job added' });
});

app.post('/addjob/delayed', async (req, res) => {
  await addDelayedJob(req.body, 5000);
  res.send({ status: 'Delayed job added' });
});

app.listen(3000, () => console.log('Server running on 3000'));