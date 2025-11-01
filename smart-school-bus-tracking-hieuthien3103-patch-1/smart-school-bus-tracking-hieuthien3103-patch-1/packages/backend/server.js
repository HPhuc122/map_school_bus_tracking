require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const studentRoutes = require('./src/routes/students');
const driverRoutes = require('./src/routes/drivers');
const busRoutes = require('./src/routes/buses');
const scheduleRoutes = require('./src/routes/schedules');
const routeRoutes = require('./src/routes/routes');
const reportRoutes = require('./src/routes/reports');
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') { app.use(morgan('dev')); }
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);
app.get('/health', (req, res) => { res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() }); });
console.log('✅ Loading students routes');
app.use('/api/students', studentRoutes);

console.log('✅ Loading drivers routes');
app.use('/api/drivers', driverRoutes);

console.log('✅ Loading buses routes');
app.use('/api/buses', busRoutes);

console.log('✅ Loading schedules routes');
app.use('/api/schedules', scheduleRoutes);

console.log('✅ Loading routes routes');
app.use('/api/routes', routeRoutes);

console.log('✅ Loading reports routes');
app.use('/api/reports', reportRoutes);

app.use('*', (req, res) => { res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }); });
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
async function startServer() {
  try {
    await testConnection();
    app.listen(PORT, HOST, () => {
      console.log('\n Smart School Bus API Server');
      console.log('================================');
      console.log(`Server running on: http://${HOST}:${PORT}`);
      console.log('================================\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer();