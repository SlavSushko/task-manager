import { BaseComponent } from '../BaseComponent.js';
import './task.css';

export class Task extends BaseComponent {
  constructor({ id, title, description, completed = false }, onDelete, onToggle) {
    super({ className: `task-card ${completed ? 'task-card_completed' : ''}` });
    this.taskId = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.onDelete = onDelete;
    this.onToggle = onToggle;
  }

  render() {
    super.render();
    this.element.setAttribute('data-id', this.taskId);

    this.element.innerHTML = `
      <div class="task-card__body">
        <h3 class="task-card__title"></h3>
        <p class="task-card__desc"></p>
      </div>
      <div class="task-card__actions">
        <button class="btn btn_small btn_secondary task-card__btn-toggle">
          ${this.completed ? 'Вернуть' : 'Готово'}
        </button>
        <button class="btn btn_small btn_danger task-card__btn-delete">Удалить</button>
      </div>
    `;

    this.element.querySelector('.task-card__title').textContent = this.title;
    this.element.querySelector('.task-card__desc').textContent = this.description || 'Без описания';

    this.attachEvents();
    return this.element;
  }

  attachEvents() {
    const toggleBtn = this.element.querySelector('.task-card__btn-toggle');
    const deleteBtn = this.element.querySelector('.task-card__btn-delete');

    toggleBtn.addEventListener('click', () => {
      this.completed = !this.completed;
      this.element.classList.toggle('task-card_completed');
      toggleBtn.textContent = this.completed ? 'Вернуть' : 'Готово';
      if (this.onToggle) this.onToggle(this);
    });

    deleteBtn.addEventListener('click', () => {
      if (this.onDelete) this.onDelete(this.taskId, this.title);
      this.destroy();
    });
  }
}