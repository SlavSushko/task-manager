import './styles/variables.css';
import './styles/main.css';
import { Task } from './components/task/task.js';
import { Notification } from './components/notification/notification.js';
import { fetchTasks } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const appContainer = document.getElementById('app');
  const taskForm = document.getElementById('task-form');
  const openModalBtn = document.getElementById('open-modal-btn');
  const notificationArea = document.getElementById('notification-container');
  const sortSelect = document.getElementById('sort-select');
  
  let tasks = [];
  let currentFilter = 'all'; 
  let currentSort = 'default';
  let taskPopupInstance = null; 

  const notify = (message) => {
    const notification = new Notification({ id: `n-${Date.now()}`, message });
    (notificationArea || document.body).appendChild(notification.render());
  };

  const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

  const updateEmptyState = (filteredCount) => {
    const existing = appContainer.querySelector('.task-grid__empty');
    if (filteredCount === 0) {
      if (!existing) {
        const msg = document.createElement('p');
        msg.className = 'task-grid__empty';
        msg.textContent = 'В этой категории пока нет задач.';
        appContainer.appendChild(msg);
      }
    } else if (existing) {
      existing.remove();
    }
  };

  const renderTasks = () => {
    appContainer.innerHTML = ''; 

    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'done') return task.completed;
      return true; 
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (currentSort === 'az') return a.title.localeCompare(b.title);
      if (currentSort === 'done-last') return Number(a.completed) - Number(b.completed);
      return 0; // По умолчанию (как добавили)
    });

    sortedTasks.forEach(taskData => {
      const taskInstance = new Task(
        taskData,
        (id, title) => {
          tasks = tasks.filter(t => t.id !== id);
          saveTasks();
          renderTasks(); 
          notify(`Удалено: "${title}"`);
        },
        (taskObj) => {
          const index = tasks.findIndex(t => t.id === taskObj.taskId);
          if (index !== -1) {
            tasks[index].completed = taskObj.completed;
            saveTasks();
            renderTasks(); 
            notify(taskObj.completed ? `Выполнено: "${taskObj.title}"` : `В работе: "${taskObj.title}"`);
          }
        }
      );
      appContainer.appendChild(taskInstance.render());
    });

    updateEmptyState(sortedTasks.length);
  };

  const handleRouting = () => {
    const hash = window.location.hash.replace('#/', '') || 'all';
    const validRoutes = ['all', 'active', 'done'];
    currentFilter = validRoutes.includes(hash) ? hash : 'all';

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('filter-btn_active', btn.dataset.filter === currentFilter);
    });

    renderTasks();
  };

  window.addEventListener('hashchange', handleRouting);

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTasks();
  });

  const initApp = async () => {
    const localData = localStorage.getItem('tasks');
    if (localData && JSON.parse(localData).length > 0) {
      tasks = JSON.parse(localData);
      notify('Данные загружены из кэша');
    } else {
      notify('Синхронизация с сервером...');
      try {
        tasks = await fetchTasks();
        saveTasks();
        notify('Задачи успешно загружены из API');
      } catch (error) {
        notify('Ошибка соединения с сервером');
      }
    }
    handleRouting(); 
  };

  openModalBtn.addEventListener('click', async () => {
    if (!taskPopupInstance) {
      notify('Загрузка модуля формы...');
      const { Popup } = await import('./components/popup/popup.js');
      taskPopupInstance = new Popup('task-modal');
      taskPopupInstance.attachEvents();
    }
    taskForm.reset();
    taskPopupInstance.open();
  });

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
      id: `t-${Date.now()}`,
      title: document.getElementById('task-title').value,
      description: document.getElementById('task-desc').value,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    taskPopupInstance.close();
    notify(`Создана задача: "${newTask.title}"`);
  });

  initApp();
});