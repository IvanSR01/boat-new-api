import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
import { UserModel } from './models/user.model.js';
dotenv.config();
export const db = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1231231',
    database: 'boat',
    models: [UserModel],
    logging: true,
});
//# sourceMappingURL=index.js.map