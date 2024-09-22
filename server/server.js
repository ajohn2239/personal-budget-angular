// Budget API

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());

app.use(express.static('public'));

app.get('/budget', (req, res) => {
    fs.readFile('budget.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to load data' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});