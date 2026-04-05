import { useApp } from '../context/AppContext';

export default function Settings() {
  const { data, updateSettings } = useApp();
  const { settings } = data;

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }
    
    if (Notification.permission === 'granted') {
      alert('Notifications already enabled!');
      return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      updateSettings({ notificationsEnabled: true });
      alert('Notifications enabled!');
    } else {
      alert('Notifications denied. Enable in browser settings.');
    }
  };

  return (
    <div className="page-content">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#1F2937' }}>⚙️ Settings</h1>

      <div className="space-y-4">
        <div className="card p-4">
          <h2 className="font-semibold mb-3">Family Members</h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Kids</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.family.kids.map(kid => (
                  <div
                    key={kid.id}
                    className="kid-badge"
                    style={{ backgroundColor: kid.color }}
                  >
                    {kid.name.charAt(0)}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {data.family.kids.map(k => k.name).join(', ')}
              </div>
            </div>
            <div className="mt-3">
              <span className="text-sm text-gray-500">Parents</span>
              <div className="mt-1 text-sm text-gray-600">
                {data.family.parents.map(p => p.name).join(', ')}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="font-semibold mb-3">🔔 Notifications</h2>
          <div className="space-y-3">
            <button
              onClick={requestNotificationPermission}
              className="btn w-full"
              style={{ backgroundColor: '#F3F4F6', color: '#374151' }}
            >
              {settings.notificationsEnabled 
                ? '✅ Notifications Enabled' 
                : 'Enable Notifications'}
            </button>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Alert before events
              </label>
              <select
                className="input w-full"
                value={settings.alertTime}
                onChange={e => updateSettings({ alertTime: Number(e.target.value) })}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={1440}>1 day</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="font-semibold mb-3">ℹ️ About</h2>
          <p className="text-sm text-gray-600">
            Family Command Center v1.0<br/>
            A simple coordination hub for busy families.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Data stored locally in your browser.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Clear all data? This cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="btn w-full"
          style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
        >
          🔴 Clear All Data
        </button>
      </div>
    </div>
  );
}
