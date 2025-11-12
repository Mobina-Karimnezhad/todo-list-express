const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static('public'));

let todos = [];
let idCounter = 1;

// Load existing todos from file safely
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE);
    todos = JSON.parse(raw);
    if (todos.length > 0) {
      idCounter = Math.max(...todos.map(t => t.id)) + 1;
    }
  } catch (err) {
    console.error('Error reading data.json, starting with empty list');
    todos = [];
  }
}

function saveToFile() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Add a new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') return res.status(400).json({ error: 'Text required' });

  const todo = { id: idCounter++, text: text.trim(), done: false };
  todos.push(todo);
  saveToFile();
  res.status(201).json(todo);
});

// Toggle done
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  todo.done = !todo.done;
  saveToFile();
  res.json(todo);
});

// Edit text
app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  const { text } = req.body;
  if (!text || text.trim() === '') return res.status(400).json({ error: 'Text required' });

  todo.text = text.trim();
  saveToFile();
  res.json(todo);
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id != req.params.id);
  saveToFile();
  res.status(204).end();
});

// 404 handler
app.use((req, res) => res.status(404).send('Not found'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

