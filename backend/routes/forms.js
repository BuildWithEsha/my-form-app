const express = require('express');
const router = express.Router();
const { pool } = require('../models/db');

// Get all forms
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM forms ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ error: 'Failed to fetch forms' });
    }
});

// Create a new form
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const result = await pool.query(
            'INSERT INTO forms (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, message]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({ error: 'Failed to create form' });
    }
});

// Get form by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM forms WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Form not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching form:', error);
        res.status(500).json({ error: 'Failed to fetch form' });
    }
});

module.exports = router;
