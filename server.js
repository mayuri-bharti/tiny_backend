import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import linkRoutes from './routes/linkRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import redirectRoutes from './routes/redirectRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/links', linkRoutes);
app.use('/healthz', healthRoutes);
app.use('/', redirectRoutes);

// Connect to MongoDB
let connectDB = async (dbUrl, dbName) => {

  try {
      await mongoose.connect(dbUrl + dbName)
      console.log("connecting to DB successfully")
  } catch (error) {
      console.log("connecting error")
  }
}

 connectDB(process.env.DBURL, process.env.DBNAME);

  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
 
   

export default app;


