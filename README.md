Job Queue System with Redis & Node.js Worker Threads

A scalable background job processing system built using Node.js, Redis, and Worker Threads.
This system supports job queues, worker pools, retries with exponential backoff, delayed jobs, and dead-letter queues.

Features

✅ Redis-based job queue (LPUSH / BRPOP)

✅ Worker thread pool for parallel job processing

✅ Event-driven worker scheduling

✅ Retry mechanism with exponential backoff

✅ Dead Letter Queue (DLQ) for failed jobs

✅ Delayed job scheduling using Redis ZSET

✅ Non-blocking async execution using AsyncResource

✅ Scalable architecture (multi-threaded workers)
