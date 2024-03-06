import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './router/index.router.js';
import { db } from './db/index.js';
import cors from 'cors';
dotenv.config();
const app = express();
const port = process.env.PORT || 4200;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
app.use('/api/v1', apiRouter);
app.listen(port, async () => {
    try {
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        await db.sync();
        console.log(`[server]: Server is running at http://localhost:${port}`);
    }
    catch (error) {
        console.log(error);
    }
});
//# sourceMappingURL=index.js.map