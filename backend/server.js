require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const formsRoutes = require('./routes/forms');
const { initializeDatabase } = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/forms', formsRoutes);

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Initialize database and start server
async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Frontend available at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
