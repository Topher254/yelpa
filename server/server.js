const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const allowedOrigins = [
  'http://localhost:5173',
  'hhttps://yelpa.vercel.app/'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});
app.get('/', (req, res) => {
  res.json({ message: 'Yelpa Server is running!' });
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const storyRoutes = require('./routes/stories');
const messageRoutes = require('./routes/messages'); // Add this
const connectionRoutes = require('./routes/connections');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes); // Add this
app.use('/api/connections', connectionRoutes);

console.log('All routes loaded');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});