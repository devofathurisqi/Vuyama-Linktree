import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes

// Get all links
app.get('/api/links', (req, res) => {
  db.all('SELECT * FROM links ORDER BY orderIndex ASC, id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const links = rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive)
    }));
    res.json(links);
  });
});

// Create a new link
app.post('/api/links', (req, res) => {
  const { title, url, isActive = true, orderIndex = 0 } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  const sql = 'INSERT INTO links (title, url, isActive, orderIndex) VALUES (?, ?, ?, ?)';
  db.run(sql, [title, url, isActive ? 1 : 0, orderIndex], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      id: this.lastID,
      title,
      url,
      isActive,
      orderIndex
    });
  });
});

// Update a link
app.put('/api/links/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, isActive, orderIndex } = req.body;

  const sql = 'UPDATE links SET title = ?, url = ?, isActive = ?, orderIndex = ? WHERE id = ?';
  db.run(sql, [title, url, isActive ? 1 : 0, orderIndex, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, title, url, isActive, orderIndex });
  });
});

// Delete a link
app.delete('/api/links/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM links WHERE id = ?';
  db.run(sql, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Deleted', changes: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
