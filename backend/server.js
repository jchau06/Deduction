import express from 'express';
import cors from 'cors';
const app = express();
const port = 5001; // Use a different port for the backend

import { fetchRandomQuotes, fetchData, saveQuotesToFile } from './extract.js';

// Middleware to parse JSON request bodies
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

app.post('/api/run-extract', async (req, res) => {
  try {
    const { mode, inputValue } = req.body;
    console.log('Received in API:', { mode, inputValue });

    // Await the save operation to ensure it's complete
    await saveQuotesToFile(fetchRandomQuotes, inputValue);

    res.status(200).json({ message: 'Extract executed successfully!' });
  } catch (error) {
    console.error('Error while running extract:', error);
    res.status(500).json({ error: 'An error occurred while running extract.' });
  }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});