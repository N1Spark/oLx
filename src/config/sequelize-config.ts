import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!, 10),
        dialect: 'mysql',
        logging: false,
    }
);

export const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('The connection was established successfully.');
    }
    catch (error) { console.error('Failed to connect to the database:', error); }
};