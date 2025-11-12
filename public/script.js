async function loadTodos(filter = null) {
  let url = '/api/todos';
  if (filter !== null) url += `?done=${filter}`;

  const res = await fetch(url);
  const todos = await res.json();

  const list = document.getElementById('list');
  list.innerHTML = '';

  todos.forEach(t => {
    const li = document.createElement('li');
    li.textContent = (t.done ? '✅ ' : '⬜ ') + t.text;
    li.onclick = () => toggle(t.id);
    li.oncontextmenu = (e) => {
      e.preventDefault();
      remove(t.id);
    };
    list.appendChild(li);
  });
}

async function addTodo() {
  const text = document.getElementById('newTodo').value.trim();
  if (!text) return alert('Enter a task!');
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  document.getElementById('newTodo').value = '';
  loadTodos();
}

async function toggle(id) {
  await fetch(`/api/todos/${id}`, { method: 'PUT' });
  loadTodos();
}

async function remove(id) {
  if (confirm('Delete this task?')) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    loadTodos();
  }
}

loadTodos();
