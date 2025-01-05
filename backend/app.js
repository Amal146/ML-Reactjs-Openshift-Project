const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index.js'); 
var cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Define allowed origins (frontend domain)
const allowedOrigins = [
    'http://front-maythistime.apps.eu46r.prod.ole.redhat.com'
];
// CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (e.g., mobile apps, curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));


// Use the router for API routes
app.use('/', indexRouter);

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  // Catch-all route for React app in production
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
} else {
  // If in development, don't serve static files here
  console.log('In development mode, React will serve the UI');
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;

