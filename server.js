import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SERVERLIST_PATH = path.join(__dirname, 'serverlist.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoints
app.get('/api/servers', (req, res) => {
    try {
        if (fs.existsSync(SERVERLIST_PATH)) {
            const data = fs.readFileSync(SERVERLIST_PATH, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error reading serverlist.json:', error);
        res.status(500).json({ error: 'Failed to read servers' });
    }
});

app.post('/api/servers', (req, res) => {
    try {
        const servers = req.body;
        fs.writeFileSync(SERVERLIST_PATH, JSON.stringify(servers, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error writing serverlist.json:', error);
        res.status(500).json({ error: 'Failed to save servers' });
    }
});

// Catch all handler: send back index.html for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});