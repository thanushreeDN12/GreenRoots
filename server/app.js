import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authenticationRoutes from './routes/authentication.js'
import programRoutes from './routes/programs.js'
import usersRoutes from './routes/users.js'
import adminRoutes from './routes/adminRoutes.js'
import apiRoutes from './routes/api.js'
import { autoSeedDatabase } from './utils/autoSeed.js'

dotenv.config()

// connecting to express
const app= express()

// using middlewares
app.use(express.json({ limit: "32mb" }));
app.use(express.urlencoded({ limit: "32mb", extended: true }));

// Timing middleware (Part A): Measures latency for incoming requests, helpful for auth performance profiling.
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[Timing] ${req.method} ${req.originalUrl} - ${duration}ms`);
    });
    next();
});

app.use(cors())


// routes
app.use('/authentication', authenticationRoutes)
app.use('/programs', programRoutes)
app.use('/users', usersRoutes)
app.use('/admin', adminRoutes)
app.use('/api', apiRoutes)

// Also mount under /api prefix for full client routing compatibility
app.use('/api/authentication', authenticationRoutes)
app.use('/api/programs', programRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/admin', adminRoutes)

// Also mount API routes directly for endpoints like /activity/recent or /impact/summary
app.use('/', apiRoutes)

// API 404 handler: Guarantee API routes never return index.html
app.use([
  '/api',
  '/admin',
  '/programs',
  '/users',
  '/authentication',
  '/activity',
  '/impact',
  '/testimonials',
  '/photos',
  '/species',
  '/cities'
], (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found` });
});

// CRITICAL route-level fallback for DB
app.use((err, req, res, next) => {
  if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || err.message.includes('buffering timed out')) {
    console.warn('[AI Studio] Database offline — returning mock empty response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
  }
  
  if (req.path.startsWith('/api') || req.path.startsWith('/admin') || req.path.startsWith('/programs') || req.path.startsWith('/users') || req.path.startsWith('/authentication') || req.path.startsWith('/activity')) {
    return res.status(err.status || 500).json({ error: err.message || 'Internal API Error' });
  }
  next(err);
});

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

app.get('*all', (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send('GreenRoots backend is active. React frontend is served once `npm run build` completes.');
    }
});


// connecting to DB
const MONGO_URI= process.env.MONGO_URI
const PORT = process.env.PORT || 3000

const connectDB= async () =>{
    try{
       await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/mock', { serverSelectionTimeoutMS: 8000 })
       console.log('[GreenRoots] Database connected successfully to MongoDB Atlas.')
       app.listen(PORT, '0.0.0.0', () =>{console.log(`Server is running on port ${PORT}`)})
       // Auto-populate database collections if empty
       await autoSeedDatabase().catch(e => console.warn('[AutoSeed] seed notice:', e.message));
    } catch(err){
        console.warn('[GreenRoots] Database not reachable, running with resilient memory store:', err.message)
        app.listen(PORT, '0.0.0.0', () =>{console.log(`Server is running on port ${PORT}`)})
    }
}

connectDB()

mongoose.connection.on("open", ()=> console.log("Connection to database is established successfully"))
mongoose.connection.on("error", (err)=> console.log(err))

