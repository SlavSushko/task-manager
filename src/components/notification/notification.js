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
    
    setTimeout(() => {
      this.element.classList.add('notification--closing');
      setTimeout(() => this.destroy(), 300);
    }, 3000);

    return this.element;
  }
}