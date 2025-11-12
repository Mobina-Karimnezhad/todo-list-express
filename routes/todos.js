// routes/todos.js
const express = require('express');
const fs = require('fs');
const router = express.Router();

const dataFile = './data/todos.json';

// --- Helper برای خواندن و نوشتن فایل (اختیاری: شبیه‌سازی DB) ---
function readTodos() {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  fs.writeFileSync(dataFile, JSON.stringify(todos, null, 2));
}

let todos = readTodos();
let id = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

// 📍 GET /api/todos
// با قابلیت فیلتر کردن بر اساس done (اختیاری)
router.get('/', (req, res) => {
  const { done } = req.query;
  let result = todos;

  if (done === 'true') result = todos.filter(t => t.done);
  if (done === 'false') result = todos.filter(t => !t.done);

  res.json(result);
});

// 📍 POST /api/todos
router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const newTodo = { id: id++, text, done: false };
  todos.push(newTodo);
  saveTodos(todos);
  res.status(201).json(newTodo);
});

// 📍 PUT /api/todos/:id
router.put('/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  todo.done = !todo.done;
  saveTodos(todos);
  res.json(todo);
});

// 📍 DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const index = todos.findIndex(t => t.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });

  todos.splice(index, 1);
  saveTodos(todos);
  res.status(204).end();
});

module.exports = router;
