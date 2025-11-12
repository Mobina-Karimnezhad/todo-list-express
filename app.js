// app.js
const express = require('express');
const fs = require('fs');
const morgan = require('morgan'); // (اختیاری) برای لاگ درخواست‌ها
const todosRouter = require('./routes/todos');

const app = express();

// --- Middlewareها ---
app.use(express.json()); // برای خواندن JSON در body
app.use(express.static('public')); // برای سرو فایل‌های HTML/CSS/JS
app.use(morgan('dev')); // (اختیاری) لاگ متد، مسیر و زمان پاسخ

// --- مسیر todos ---
app.use('/api/todos', todosRouter);

// --- خطای 404 ---
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// --- هندلر مرکزی خطاها ---
app.use((err, req, res, next) => {
  console.error('⚠️ Server Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// --- اجرا ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
