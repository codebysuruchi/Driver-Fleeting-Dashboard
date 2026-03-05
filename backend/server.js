import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import { startSimulator } from './services/simulator.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'okdriver_fleet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.locals.pool = pool;
app.locals.io = io;

// API Endpoints
app.get('/api/metrics', async (req, res) => {
  try {
    const [trips] = await pool.query('SELECT COUNT(*) as total FROM trips');
    const [activeTrips] = await pool.query("SELECT COUNT(*) as live FROM trips WHERE status='active'");
    const [violations] = await pool.query('SELECT COUNT(*) as count FROM events WHERE type != "normal"');
    const [drivers] = await pool.query('SELECT AVG(risk_score) as avg_risk FROM drivers');

    res.json({
      totalTrips: trips[0].total,
      liveDrivers: activeTrips[0].live,
      violationCount: violations[0].count,
      avgRiskScore: Math.round(drivers[0].avg_risk || 0)
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/events', async (req, res) => {
  const { trip_id, type, speed } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO events (trip_id, type, speed) VALUES (?, ?, ?)',
      [trip_id, type, speed]
    );

    // Broadcast event
    const newEvent = { id: result.insertId, trip_id, type, speed, timestamp: new Date() };
    io.emit('new_event', newEvent);

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// WebSocket Connection handler
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Try checking DB connection
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL Database');
    connection.release();

    // Start dummy data simulator
    startSimulator(pool, io);
  } catch (err) {
    console.error('Failed to connect to MySQL database:', err.message);
    console.log('Please ensure MySQL is running and the okdriver_fleet database exists.');
  }
});
