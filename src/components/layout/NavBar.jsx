import useAudio from '../../hooks/useAudio';

const NAV_ITEMS = [
  { id: 'board',   label: 'Board',   icon: '📋' },
  { id: 'log',     label: 'Log',     icon: '📜' },
  { id: 'room',    label: 'Room',    icon: '🏠' },
  { id: 'sound',   label: 'Sound',   icon: null },
];

export default function NavBar({ activeTab, onTabChange }) {
  const { muted, toggle } = useAudio();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: '#2A1508',
        borderTop: '4px solid #1a0a05',
        boxShadow: '0 -2px 0 #5A3420, inset 0 2px 0 rgba(139,94,60,0.3)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="max-w-[420px] mx-auto flex">
        {NAV_ITEMS.map((item) => {
          if (item.id === 'sound') {
            return (
              <button
                key={item.id}
                onClick={toggle}
                className="flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors"
                style={{ color: '#8B7355' }}
              >
                <span className="text-xl leading-none mb-1">
                  {muted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}
                </span>
                <span className="font-pixel text-[6px] leading-none">
                  {muted ? 'Muted' : 'Sound'}
                </span>
              </button>
            );
          }

          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors"
              style={{
                color: active ? '#D4A055' : '#8B7355',
                backgroundColor: active ? 'rgba(212,160,85,0.08)' : 'transparent',
              }}
            >
              <span className="text-xl leading-none mb-1">{item.icon}</span>
              <span className="font-pixel text-[6px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
