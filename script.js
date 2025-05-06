const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const taskList = document.getElementById('taskList');

const rightPanel = document.getElementById('rightPanel');
const panelContent = document.getElementById('panelContent');

const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = taskInput.value.trim();
  const taskDate = dateInput.value;

  if (taskName && taskDate) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>
        <strong class="task-name">${taskName}</strong><br>
        <small class="task-date">Due: ${taskDate}</small>
      </span>
      <div class="task-actions">
        <button class="info-btn">Info</button>
        <button class="update-btn">Update</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
    taskForm.reset();
    updateCounts();
  }
});

taskList.addEventListener('click', (e) => {
  const target = e.target;
  const taskItem = target.closest('li');
  if (!taskItem) return;

  const name = taskItem.querySelector('.task-name').textContent;
  const date = taskItem.querySelector('.task-date').textContent;

  if (target.classList.contains('info-btn')) {
    panelContent.innerHTML = `
      <button class="close-btn" onclick="document.getElementById('rightPanel').classList.remove('open')">✖</button>
      <h3>Task Info</h3>
      <div class="task-info">
        <p><strong>Task:</strong> ${name}</p>
        <p><strong>${date}</strong></p>
      </div>
    `;
    rightPanel.classList.add('open');
  }

  if (target.classList.contains('update-btn')) {
    showUpdatePopup(taskItem);
  }

  if (target.classList.contains('delete-btn')) {
    if (confirm(`Delete "${name}"?`)) {
      taskItem.remove();
      showCongrats(`Task "${name}" deleted!`);
      updateCounts();
    }
  }
});

taskList.addEventListener('dblclick', (e) => {
  const taskItem = e.target.closest('li');
  if (!taskItem || taskItem.classList.contains('completed')) return;

  const taskName = taskItem.querySelector('.task-name').textContent;

  if (confirm(`Mark "${taskName}" as complete?`)) {
    taskItem.classList.add('completed');
    showCongrats(`🎉 "${taskName}" completed!`);
    setTimeout(() => {
      taskItem.remove();
      updateCounts();
    }, 2000); // remove after animation
  }
});

function showUpdatePopup(taskItem) {
  const currentName = taskItem.querySelector('.task-name').textContent;
  const currentDate = taskItem.querySelector('.task-date').textContent.replace('Due: ', '');

  const popup = document.createElement('div');
  popup.className = 'update-popup';
  popup.innerHTML = `
    <h3>Update Task</h3>
    <input type="text" id="popupTaskName" value="${currentName}">
    <input type="date" id="popupTaskDate" value="${currentDate}">
    <button id="saveUpdate">Save</button>
    <button id="cancelUpdate">Cancel</button>
  `;
  document.body.appendChild(popup);

  popup.querySelector('#saveUpdate').addEventListener('click', () => {
    const newName = popup.querySelector('#popupTaskName').value.trim();
    const newDate = popup.querySelector('#popupTaskDate').value;

    if (newName && newDate) {
      taskItem.querySelector('.task-name').textContent = newName;
      taskItem.querySelector('.task-date').textContent = `Due: ${newDate}`;
      popup.remove();
    }
  });

  popup.querySelector('#cancelUpdate').addEventListener('click', () => {
    popup.remove();
  });
}

function showCongrats(message) {
  const msg = document.createElement('div');
  msg.className = 'congrats-message';
  msg.textContent = message;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2500);
}

function updateCounts() {
  const all = taskList.querySelectorAll('li');
  const completed = taskList.querySelectorAll('li.completed');
  const pending = all.length - completed.length;

  totalCount.textContent = all.length;
  completedCount.textContent = completed.length;
  pendingCount.textContent = pending;
}
