import { createClient } from 'redis';
import { REDIS_URL } from './env';

const client = createClient({
    url: REDIS_URL
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});


export default client;
