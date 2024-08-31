document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

document.getElementById('add-task-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('task-name').value;
    const description = document.getElementById('task-desc').value;
    const dueDate = document.getElementById('task-due').value;

    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, dueDate })
    })
    .then(response => response.json())
    .then(() => {
        alert('Tarea agregada');
        loadTasks(); // Actualizar la lista de tareas
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('update-task-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('update-task-id').value;
    const name = document.getElementById('update-task-name').value;
    const description = document.getElementById('update-task-desc').value;
    const dueDate = document.getElementById('update-task-due').value;
    const completed = document.getElementById('update-task-completed').checked;

    fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, dueDate, completed })
    })
    .then(response => response.json())
    .then(() => {
        alert('Tarea actualizada');
        loadTasks(); // Actualizar la lista de tareas
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('delete-task-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('delete-task-id').value;

    fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        alert('Tarea eliminada');
        loadTasks(); // Actualizar la lista de tareas
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('register-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
});

document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
});

function loadTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            const tasksContainer = document.getElementById('tasks-container');
            tasksContainer.innerHTML = ''; // Limpiar tareas existentes
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task-item';
                taskElement.innerHTML = `
                    <h3>${task.name}</h3>
                    <p>${task.description || 'Sin descripción'}</p>
                    <p>Fecha de Vencimiento: ${new Date(task.dueDate).toLocaleDateString()}</p>
                    <p>Estado: ${task.completed ? 'Completada' : 'Pendiente'}</p>
                    <p>ID: ${task._id}</p>
                    <button onclick="updateTask('${task._id}')">Actualizar</button>
                    <button onclick="deleteTask('${task._id}')">Eliminar</button>
                `;
                tasksContainer.appendChild(taskElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

function updateTask(id) {
    document.getElementById('update-task-id').value = id;
    // Puedes agregar lógica para llenar los otros campos basados en la tarea seleccionada
}

function deleteTask(id) {
    document.getElementById('delete-task-id').value = id;
    document.getElementById('delete-task-form').dispatchEvent(new Event('submit'));
}
