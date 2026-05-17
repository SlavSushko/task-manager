import { BaseComponent } from '../BaseComponent.js';
import './popup.css';

export class Popup extends BaseComponent {
  constructor(modalId) {
    super({ id: modalId }); 
    this.render(); 
    this.closeBtn = this.element.querySelector('.popup__close');
    this.overlay = this.element.querySelector('.popup__overlay');
  }

  open() {
    this.element.classList.remove('popup_hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.element.classList.add('popup_hidden');
    document.body.style.overflow = '';
  }

  attachEvents(onCloseCallback) {
    const closeHandler = () => {
      this.close();
      if (onCloseCallback) onCloseCallback();
    };
    this.closeBtn.addEventListener('click', closeHandler);
    this.overlay.addEventListener('click', closeHandler);
  }
}