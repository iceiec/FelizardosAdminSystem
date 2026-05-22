const express =  require('express');
const cors = require('cors');
require('dotenv').config();

const app = express ();

//Middleware
app.use(cors());
app.use(express.json());

//Test route
app.get('/api/health', (req, res) => {
    res.json({message : 'Server is running!' });
});

//Routings
//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: "Something went wrong!",
        message: err.message
    });
});

module.exports = app;