import { client } from './redis.js';

export const QUEUE = 'job_queue';
export const HIGH_QUEUE = 'job_queue_high';
export const DELAYED_QUEUE = 'job_queue_delayed';
export const DEAD_QUEUE = 'job_queue_dead';

export async function addJob(job, priority = 'normal') {
  const data = JSON.stringify(job);

  if (priority === 'high') {
    await client.LPUSH(HIGH_QUEUE, data);
  } else {
    await client.LPUSH(QUEUE, data);
  }
}

export async function addDelayedJob(job, delayMs) {
  const time = Date.now() + delayMs;
  await client.ZADD(DELAYED_QUEUE, [{ score: time, value: JSON.stringify(job) }]);
}

export async function moveDelayedJobs() {
  const now = Date.now();
  const jobs = await client.ZRANGEBYSCORE(DELAYED_QUEUE, 0, now);

  for (const job of jobs) {
    await client.LPUSH(QUEUE, job);
    await client.ZREM(DELAYED_QUEUE, job);
  }
}

export async function getJob() {
  return await client.BRPOP([HIGH_QUEUE, QUEUE], 0);
}

export async function moveToDeadQueue(job) {
  await client.LPUSH(DEAD_QUEUE, JSON.stringify(job));
}