const { Pool } = require('pg');

// Disable SSL certificate verification for development (only for local testing)
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// For Supabase, use connection string format or individual parameters
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 
        `postgresql://${process.env.DB_USER}:${process.env.DB_PASS || process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`,
    // Supabase uses SSL
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});

// Initialize database
async function initializeDatabase() {
    try {
        const client = await pool.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS forms (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database initialized successfully');
        client.release();
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

module.exports = { pool, initializeDatabase };
