import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error("Missing required database environment variables.");
}

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_CA ? {
        rejectUnauthorized: true,
        ca: process.env.DB_CA,
    } : undefined,  
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function testConnection() {
    try {
        const [rows] = await connection.query('SELECT NOW()');
        console.log('Database connection successful:', rows);
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

testConnection();

export default connection;
