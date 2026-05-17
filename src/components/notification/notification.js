import { BaseComponent } from '../BaseComponent.js';
import './notification.css';

export class Notification extends BaseComponent {
  constructor({ id, message }) {
    super({ id, className: 'notification' });
    this.message = message;
  }

  render() {
    super.render();
    const p = document.createElement('p');
    p.className = 'notification__text';
    p.textContent = this.message;
    this.element.appendChild(p);
    
    // Запускаем исчезновение через 3 секунды
    setTimeout(() => {
      this.element.classList.add('notification--closing');
      // Удаляем из DOM после завершения анимации (0.3s)
      setTimeout(() => this.destroy(), 300);
    }, 3000);

    return this.element;
  }
}