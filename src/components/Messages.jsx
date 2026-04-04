import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Messages() {
  const { data, addMessage } = useApp();
  const [selectedParent, setSelectedParent] = useState(data.parents[1]?.id || 2);
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (!messageText.trim()) return;
    addMessage(messageText, selectedParent);
    setMessageText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentUser = data.parents[0];
  const otherMessages = data.messages.filter(m => m.fromId !== currentUser?.id);
  const myMessages = data.messages.filter(m => m.fromId === currentUser?.id);

  return (
    <div className="page-content">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#1F2937' }}>💬 Messages</h1>

      <div className="space-y-4">
        <div className="card p-4">
          <h2 className="font-semibold mb-3">Send to:</h2>
          <div className="flex gap-2">
            {data.parents.filter(p => p.id !== currentUser?.id).map(parent => (
              <button
                key={parent.id}
                onClick={() => setSelectedParent(parent.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedParent === parent.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                style={{
                  backgroundColor: selectedParent === parent.id ? '#6366F1' : '#F3F4F6',
                  color: selectedParent === parent.id ? 'white' : '#374151'
                }}
              >
                {parent.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {data.messages.length === 0 ? (
            <div className="card p-6 text-center text-gray-500">
              No messages yet. Say hi to your partner! 👋
            </div>
          ) : (
            data.messages.map(msg => {
              const sender = data.parents.find(p => p.id === msg.fromId);
              const isMe = msg.fromId === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`card p-4 ${isMe ? 'ml-8' : 'mr-8'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{sender?.name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p>{msg.content}</p>
                </div>
              );
            })
          )}
        </div>

        <div className="card p-3 flex gap-2 fixed bottom-20 left-4 right-4 md:left-[224px] md:right-4">
          <input
            type="text"
            className="input flex-1"
            placeholder="Type a message..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSend}
            className="btn btn-primary px-4"
            disabled={!messageText.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
