import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Calendar from './components/Calendar';
import Chores from './components/Chores';
import Messages from './components/Messages';
import Settings from './components/Settings';

const NAV_ITEMS = [
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'chores', label: 'Chores', icon: '🧹' },
  { id: 'messages', label: 'Messages', icon: '💬', hasBadge: true },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

function Navigation({ currentView, setCurrentView, isDesktop }) {
  const { data } = useApp();
  const unreadCount = data.messages.length;

  if (isDesktop) {
    return (
      <nav className="sidebar">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-primary" style={{ color: '#6366F1' }}>
            🏠 Family HQ
          </h1>
        </div>
        <div className="space-y-2">
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
              {item.hasBadge && unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </div>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="tab-bar">
      {NAV_ITEMS.map(item => (
        <div
          key={item.id}
          className={`tab-item ${currentView === item.id ? 'active' : ''}`}
          onClick={() => setCurrentView(item.id)}
        >
          <span className="tab-icon relative">
            {item.icon}
            {item.hasBadge && unreadCount > 0 && (
              <span className="unread-badge" style={{ position: 'absolute', top: -4, right: -6 }}>
                {unreadCount}
              </span>
            )}
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
}

function NotificationChecker() {
  const { data } = useApp();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!data.settings.notificationsEnabled) return;
    if (!('Notification' in window)) return;

    const checkEvents = () => {
      const now = new Date();
      const alertMs = data.settings.alertTime * 60 * 1000;
      
      data.events.forEach(event => {
        if (!event.date || !event.time) return;
        const eventTime = new Date(`${event.date}T${event.time}`);
        const diff = eventTime - now;
        
        if (diff > 0 && diff <= alertMs) {
          const kid = data.family.kids.find(k => k.id === event.kidId);
          const message = `${kid?.name}'s "${event.title}" starts soon!`;
          
          if (toast !== message) {
            setToast(message);
            new Notification('Family Command Center', { body: message });
            setTimeout(() => setToast(null), 5000);
          }
        }
      });
    };

    const interval = setInterval(checkEvents, 60000);
    checkEvents();
    
    return () => clearInterval(interval);
  }, [data.events, data.settings]);

  if (!toast) return null;
  
  return <div className="toast">{toast}</div>;
}

function AppContent() {
  const { currentView, setCurrentView, isDesktop } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <Calendar />;
      case 'chores':
        return <Chores />;
      case 'messages':
        return <Messages />;
      case 'settings':
        return <Settings />;
      default:
        return <Calendar />;
    }
  };

  return (
    <div className={isDesktop ? 'md:ml-[220px]' : ''}>
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        isDesktop={isDesktop}
      />
      {renderView()}
      <NotificationChecker />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
