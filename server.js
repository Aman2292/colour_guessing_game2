const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint to verify if the server is running
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Middleware to check if the server is running before serving main.js
app.use('/main.js', (req, res, next) => {
  axios.get(`http://localhost:${PORT}/health`)
    .then(() => {
      next(); // Continue to serve main.js if the server is running
    })
    .catch(() => {
      res.status(500).send('Server is not running. Please run server.js to play the game.');
    });
});

// Serve main.js
app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.js'));
});

// Serve color-guessing-game.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'color-guessing-game.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
