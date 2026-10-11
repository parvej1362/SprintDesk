import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI);

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[Database] Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] Connection Disconnected');
    });

    return conn;
  } catch (error) {
    console.error(`[Database] Connection Failure: ${error.message}`);
    throw error;
  }
}
