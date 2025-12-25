const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

/*
|--------------------------------------------------------------------------
| MongoDB
|--------------------------------------------------------------------------
*/
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/professor', require('./routes/professorRoutes'));
app.use('/api/modules', require('./routes/moduleRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/branches', require('./routes/branchRoutes'));

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API running',
    time: new Date()
  });
});

/*
|--------------------------------------------------------------------------
| Error handling
|--------------------------------------------------------------------------
*/
const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
