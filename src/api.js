const MOCK_TASKS = [
  { id: 't-1', title: 'Изучить БЭМ', description: 'Понять логику формирования блоков.', completed: false },
  { id: 't-2', title: 'Написать ООП классы', description: 'Создать BaseComponent.', completed: false }
];

export const fetchTasks = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    return data.map(item => ({
      id: `api-${item.id}`,
      title: item.title,
      description: 'Загружено из внешнего API',
      completed: item.completed
    }));
  } catch (error) {
    console.warn('Внешний API недоступен, используем локальные данные:', error);
    return MOCK_TASKS;
  }
};