import { Task } from './task.js';

describe('Task component', () => {
  it('создаёт элемент с правильным заголовком', () => {
    const task = new Task(
      { id: '1', title: 'Тест', description: 'Описание', completed: false },
      jest.fn(),
      jest.fn()
    );
    
    const el = task.render();
    expect(el.querySelector('.task-card__title').textContent).toBe('Тест');
  });

  it('добавляет класс task-card_completed для выполненной задачи', () => {
    const task = new Task(
      { id: '2', title: 'Выполнено', description: '', completed: true },
      jest.fn(), 
      jest.fn()
    );
    
    const el = task.render();
    expect(el.classList.contains('task-card_completed')).toBe(true);
  });
});