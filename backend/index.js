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


const apiRouter = express.Router();


apiRouter.get('/health', (req, res) => res.json({ status: 'ok' }));
apiRouter.use('/auth', authRoutes);
apiRouter.use('/notes', noteRoutes);
apiRouter.use('/tenants', tenantRoutes);


app.use('/api', apiRouter);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;
