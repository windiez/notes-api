'use strict';

const express = require('express');
const app = express();
app.use(express.json());

let notes = {};
let nextId = 1;

// List all notes
app.get('/notes', (req, res) => {
  res.json(Object.values(notes));
});

// Get a single note
app.get('/notes/:id', (req, res) => {
  const note = notes[req.params.id];
  if (!note) return res.status(404).json({ error: 'Not found' });
  res.json(note);
});

// Create a note
app.post('/notes', (req, res) => {
  const { title, body } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const id = String(nextId++);
  notes[id] = { id, title, body: body || '', updatedAt: Date.now() };
  res.status(201).json(notes[id]);
});

// Update a note
app.put('/notes/:id', (req, res) => {
  const note = notes[req.params.id];
  if (!note) return res.status(404).json({ error: 'Not found' });
  const { title, body } = req.body;
  if (title !== undefined) note.title = title;
  if (body !== undefined) note.body = body;
  note.updatedAt = Date.now();
  res.json(note);
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
  if (!notes[req.params.id]) return res.status(404).json({ error: 'Not found' });
  delete notes[req.params.id];
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

module.exports = app;
