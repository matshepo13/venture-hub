const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Get the Venture directory path (two levels up from server.js)
const venturePath = path.join(__dirname, '../..');

// Serve static files from the Venture directory
app.use(express.static(venturePath));

// API routes
app.use('/api', routes);

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(venturePath, 'index.html'));
});

// Handle other routes
app.get('*', (req, res) => {
    const filePath = path.join(venturePath, req.path);
    if (require('fs').existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});