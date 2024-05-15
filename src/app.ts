import express from 'express';
import connectDB from './config/db';
import { APP_PORT } from './config/env';
import redisClient from './config/redis';

const app = express();

connectDB();

app.use(express.json());
app.get('/', async (_, res) => {
    try {
        await redisClient.connect();
        await redisClient.set(`accountNumber:1`, JSON.stringify({'id' : 1}));
        res.json("OK");
    } catch (error: any) {
        res.json(error.message);
    }
})
const PORT = APP_PORT || 300

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
