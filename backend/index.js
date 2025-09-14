// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const tenantRoutes = require('./routes/tenantRoutes');


connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tenants', tenantRoutes);

module.exports = app;
