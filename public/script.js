const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Load all todos from server
async function loadTasks() {
  const res = await fetch('/api/todos');
  const todos = await res.json();

  taskList.innerHTML = '';
  todos.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task';
    if (t.done) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = t.text;

    // Done button
    const doneBtn = document.createElement('button');
    doneBtn.textContent = '✔';
    doneBtn.className = 'btn-done';
    doneBtn.addEventListener('click', async () => {
      await fetch(`/api/todos/${t.id}`, { method: 'PUT' });
      loadTasks();
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', async () => {
      const newText = prompt('Edit task:', t.text);
      if (newText && newText.trim() !== '') {
        await fetch(`/api/todos/${t.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: newText.trim() })
        });
        loadTasks();
      }
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', async () => {
      await fetch(`/api/todos/${t.id}`, { method: 'DELETE' });
      loadTasks();
    });

    li.appendChild(doneBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    li.appendChild(span);
    taskList.appendChild(li);
  });
}

// Add new task
addBtn.addEventListener('click', async () => {
  const text = taskInput.value.trim();
  if (!text) return;

  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  taskInput.value = '';
  loadTasks();
});

loadTasks();
