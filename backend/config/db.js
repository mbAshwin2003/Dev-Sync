import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devsync');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not crash the server in dev mode if database is not running, so developers can still see the frontend and Mock APIs.
    console.log('Continuing server execution with fallback/mock data models...');
  }
};

export default connectDB;
