import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: '127.0.0.1', // Ensure it matches your Redis setup
    port: 6379,
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

export default redisClient;
