const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index.js'); 
const cors = require('cors');


const app = express();
// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

