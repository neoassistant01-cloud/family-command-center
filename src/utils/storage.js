const STORAGE_KEY = 'family-command-center';

const defaultFamily = {
  kids: [
    { id: 1, name: 'Emma', color: '#EC4899' },
    { id: 2, name: 'Jack', color: '#8B5CF6' },
    { id: 3, name: 'Sophie', color: '#06B6D4' },
  ],
  parents: [
    { id: 1, name: 'Mom' },
    { id: 2, name: 'Dad' },
  ],
};

const defaultChores = [
  { id: '1', title: 'Make bed', assigneeId: 1, status: 'pending' },
  { id: '2', title: 'Do dishes', assigneeId: 2, status: 'pending' },
  { id: '3', title: 'Take out trash', assigneeId: 3, status: 'pending' },
  { id: '4', title: 'Feed dog', assigneeId: 1, status: 'pending' },
  { id: '5', title: 'Clean room', assigneeId: 2, status: 'pending' },
  { id: '6', title: 'Laundry', assigneeId: 3, status: 'pending' },
];

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return {
    family: defaultFamily,
    events: [],
    chores: defaultChores,
    messages: [],
    settings: {
      notificationsEnabled: true,
      alertTime: 30,
    },
  };
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
