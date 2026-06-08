const express =  require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./database/connection');


const app = express ();

//Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
// Pavilion routes
app.use('/api/pavilion', require('./routes/pavilion'));
app.use('/api/pavilion/bookings', require('./routes/pavilionBookings'));
app.use('/api/pool/bookings', require('./routes/poolBookings'));
app.use('/api/court/schedules', require('./routes/courtSchedules'));
app.use('/api/pool', require('./routes/pool'));
app.use('/api/court', require('./routes/court'));
app.use('/api/maintenance', require('./routes/maintenance'));

//Test route
app.get('/api/health', async (req, res, next) => {
   try{
    await pool.query('SELECT 1');
    res.json ({ message: 'Server is running', database: 'connected'});
   } catch (error){
    next(error);
   }
});

//Routings
//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: "Something went wrong!",
        message: err.message,
    });
});

module.exports = app;