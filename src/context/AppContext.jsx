import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadData, saveData } from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [data, setData] = useState(() => loadData());
  const [currentView, setCurrentView] = useState('calendar');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateData = useCallback((updater) => {
    setData(prev => ({ ...prev, ...updater(prev) }));
  }, []);

  const addEvent = useCallback((event) => {
    setData(prev => ({
      ...prev,
      events: [...prev.events, { ...event, id: Date.now().toString() }],
    }));
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const deleteEvent = useCallback((id) => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id),
    }));
  }, []);

  const toggleChore = useCallback((id) => {
    setData(prev => ({
      ...prev,
      chores: prev.chores.map(c => 
        c.id === id ? { ...c, status: c.status === 'done' ? 'pending' : 'done' } : c
      ),
    }));
  }, []);

  const rotateChore = useCallback((id) => {
    setData(prev => {
      const chore = prev.chores.find(c => c.id === id);
      if (!chore) return prev;
      const kidIds = prev.family.kids.map(k => k.id);
      const currentIndex = kidIds.indexOf(chore.assigneeId);
      const nextIndex = (currentIndex + 1) % kidIds.length;
      return {
        ...prev,
        chores: prev.chores.map(c => 
          c.id === id ? { ...c, assigneeId: kidIds[nextIndex] } : c
        ),
      };
    });
  }, []);

  const addMessage = useCallback((content, fromId) => {
    setData(prev => ({
      ...prev,
      messages: [...prev.messages, {
        id: Date.now().toString(),
        content,
        fromId,
        timestamp: new Date().toISOString(),
        read: false,
      }],
    }));
  }, []);

  const markMessageRead = useCallback((id) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === id ? { ...m, read: true } : m),
    }));
  }, []);

  const updateSettings = useCallback((updates) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  const value = {
    data,
    currentView,
    setCurrentView,
    isDesktop,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleChore,
    rotateChore,
    addMessage,
    markMessageRead,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
