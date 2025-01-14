const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

let sheetsData = {}; // In-memory storage for simplicity

// Fetch spreadsheet data
app.get('/api/sheet/:id', (req, res) => {
    const { id } = req.params;
    const data = sheetsData[id] || { cells: {}, metadata: {} };
    res.json(data);
});

// Save spreadsheet data
app.post('/api/sheet/:id', (req, res) => {
    const { id } = req.params;
    const { cells, metadata } = req.body;
    sheetsData[id] = { cells, metadata };
    res.status(200).json({ message: 'Sheet saved successfully!' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});