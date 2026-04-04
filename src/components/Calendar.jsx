import { useState } from 'react';
import { useApp } from '../context/AppContext';

const EVENT_TYPES = [
  { value: 'activity', label: 'Activity', color: '#F59E0B' },
  { value: 'appointment', label: 'Appointment', color: '#6366F1' },
  { value: 'school', label: 'School', color: '#10B981' },
  { value: 'other', label: 'Other', color: '#6B7280' },
];

export default function Calendar() {
  const { data, addEvent, deleteEvent } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    kidId: data.family.kids[0]?.id || 1,
    type: 'activity',
    date: new Date().toISOString().split('T')[0],
    time: '15:00',
    duration: 60,
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return data.events.filter(e => e.date === dateStr);
  };

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    addEvent(newEvent);
    setShowModal(false);
    setNewEvent({
      title: '',
      kidId: data.family.kids[0]?.id || 1,
      type: 'activity',
      date: newEvent.date,
      time: '15:00',
      duration: 60,
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const days = getDaysInMonth(selectedDate);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-content">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>📅 Calendar</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Add
        </button>
      </div>

      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
            ◀
          </button>
          <span className="font-semibold text-lg">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const dateStr = day.date.toISOString().split('T')[0];
            const events = getEventsForDate(day.date);
            const isToday = dateStr === today;
            return (
              <div
                key={idx}
                className={`aspect-square p-1 flex flex-col items-center rounded-lg cursor-pointer transition ${
                  day.isCurrentMonth ? 'hover:bg-gray-50' : ''
                } ${isToday ? 'bg-amber-100' : ''}`}
              >
                <span className={`text-sm ${isToday ? 'font-bold text-amber-700' : ''}`}>
                  {day.date.getDate()}
                </span>
                {events.length > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {events.slice(0, 3).map((e, i) => {
                      const kid = data.family.kids.find(k => k.id === e.kidId);
                      return (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: kid?.color || '#6366F1' }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Today's Events</h2>
        {getEventsForDate(new Date()).length === 0 ? (
          <div className="card p-6 text-center text-gray-500">
            No events today. Tap + to add one!
          </div>
        ) : (
          getEventsForDate(new Date()).map(event => {
            const kid = data.family.kids.find(k => k.id === event.kidId);
            const typeInfo = EVENT_TYPES.find(t => t.value === event.type);
            return (
              <div key={event.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="kid-badge"
                    style={{ backgroundColor: kid?.color || '#6366F1' }}
                  >
                    {kid?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">
                      {event.time} • {event.duration}min • {typeInfo?.label}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  🗑️
                </button>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-xl mb-4">Add Event</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Soccer practice"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kid
                </label>
                <select
                  className="input w-full"
                  value={newEvent.kidId}
                  onChange={e => setNewEvent({ ...newEvent, kidId: Number(e.target.value) })}
                >
                  {data.family.kids.map(kid => (
                    <option key={kid.id} value={kid.id}>{kid.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="input w-full"
                  value={newEvent.type}
                  onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="input w-full"
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="input w-full"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="input w-full"
                  value={newEvent.duration}
                  onChange={e => setNewEvent({ ...newEvent, duration: Number(e.target.value) })}
                />
              </div>

              <button onClick={handleAddEvent} className="btn btn-primary w-full mt-2">
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
