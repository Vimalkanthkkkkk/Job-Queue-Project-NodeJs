import { createClient } from 'redis';

export const client = createClient();

client.on('error', err => console.log('Redis Error:', err));

await client.connect();