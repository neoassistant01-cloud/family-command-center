import { useApp } from '../context/AppContext';

export default function Chores() {
  const { data, toggleChore, rotateChore } = useApp();

  const pendingChores = data.chores.filter(c => c.status === 'pending');
  const doneChores = data.chores.filter(c => c.status === 'done');

  return (
    <div className="page-content">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#1F2937' }}>🧹 Chore Board</h1>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="text-amber-500">⏳</span> Pending ({pendingChores.length})
          </h2>
          <div className="grid gap-3">
            {pendingChores.map(chore => {
              const kid = data.family.kids.find(k => k.id === chore.assigneeId);
              return (
                <div
                  key={chore.id}
                  className="card p-4 chore-card cursor-pointer"
                  onClick={() => toggleChore(chore.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"
                      />
                      <div>
                        <div className="font-medium">{chore.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="kid-badge text-xs"
                            style={{ 
                              backgroundColor: kid?.color || '#6366F1',
                              width: 24,
                              height: 24,
                              fontSize: 11
                            }}
                          >
                            {kid?.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm text-gray-500">{kid?.name}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateChore(chore.id);
                      }}
                      className="text-sm text-gray-500 hover:text-primary transition p-2"
                      title="Rotate to next kid"
                    >
                      🔄
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="text-green-500">✅</span> Done ({doneChores.length})
          </h2>
          <div className="grid gap-3">
            {doneChores.map(chore => {
              const kid = data.family.kids.find(k => k.id === chore.assigneeId);
              return (
                <div
                  key={chore.id}
                  className="card p-4 chore-card cursor-pointer opacity-60"
                  onClick={() => toggleChore(chore.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#10B981' }}
                      >
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <div className="font-medium line-through text-gray-400">
                          {chore.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="kid-badge text-xs"
                            style={{ 
                              backgroundColor: kid?.color || '#6366F1',
                              width: 24,
                              height: 24,
                              fontSize: 11
                            }}
                          >
                            {kid?.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm text-gray-400">{kid?.name}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateChore(chore.id);
                      }}
                      className="text-sm text-gray-400 hover:text-primary transition p-2"
                      title="Rotate to next kid"
                    >
                      🔄
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {data.chores.length === 0 && (
          <div className="card p-6 text-center text-gray-500">
            No chores yet. Add some in Settings!
          </div>
        )}
      </div>
    </div>
  );
}
