import * as dotenv from "dotenv";
dotenv.config();

export default {
    PORT: process.env.PORT,
    DB_DIALECT: process.env.DB_DIALECT,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,

    JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || "jwt_please_change",
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1h",
    SALT_ROUNDS: process.env.SALT_ROUNDS,

    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD
};