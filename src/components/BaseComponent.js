export class BaseComponent {
  constructor({ id = null, className = '', tag = 'div' }) {
    this.id = id;
    this.className = className;
    this.tag = tag;
    this.element = null;
  }

  render() {
    if (this.id && document.getElementById(this.id)) {
      this.element = document.getElementById(this.id);
    } else {
      this.element = document.createElement(this.tag);
      if (this.id) this.element.id = this.id;
      if (this.className) this.element.className = this.className;
    }
    return this.element;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  attachEvents() {}
}