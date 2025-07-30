import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('Harap setel MONGODB_URI di .env.local')
}

let isConnected = false;

const connectMongoDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) return

  try {
    await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log('Atlas MongoDB connected')
  } catch (err) {
    console.error('Atlas MongoDB connection error:', err)
    throw err
  }
}

export default connectMongoDB;
