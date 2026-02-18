import { GRADES, GRADE_COLORS, STYLES } from '../../data/grades';

const styleList = Object.values(STYLES);

export default function ProblemEntry({ index, problem, discipline, onChange, onRemove }) {
  const isBoard = discipline === 'board';

  return (
    <div
      className="plank-border wood-grain relative p-3"
      style={{ backgroundColor: '#3D2317' }}
    >
      {/* Problem number + remove */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-[7px] text-tavern-parchment/50">
          #{index + 1}
        </span>
        <button
          onClick={onRemove}
          className="font-body text-lg text-tavern-red/70 hover:text-tavern-red leading-none min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          x
        </button>
      </div>

      {/* ── Grade selector ── */}
      <div className="mb-3">
        <label className="font-pixel text-[6px] text-tavern-parchment/50 block mb-1">
          Grade
        </label>
        <div className="grid grid-cols-5 gap-1">
          {GRADES.map((g) => {
            const active = problem.grade === g;
            const color = GRADE_COLORS[g];
            const isDark = ['V7', 'V8+'].includes(g);
            return (
              <button
                key={g}
                onClick={() => onChange({ grade: g })}
                className="relative min-h-[44px] px-1 py-2 font-pixel text-[7px] leading-none transition-all text-center"
                style={{
                  backgroundColor: active ? color : '#251008',
                  color: active
                    ? isDark ? '#F5E6C8' : '#1a0a05'
                    : color,
                  border: `2px solid ${active ? '#1a0a05' : '#3A2010'}`,
                  boxShadow: active
                    ? `0 0 6px ${color}60, inset 0 1px 0 rgba(255,255,255,0.15)`
                    : 'none',
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Style selector (hidden for Board) ── */}
      {!isBoard && (
        <div className="mb-3">
          <label className="font-pixel text-[6px] text-tavern-parchment/50 block mb-1">
            Style
          </label>
          <div className="grid grid-cols-2 gap-1">
            {styleList.map((s) => {
              const active = problem.style === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onChange({ style: s.id })}
                  className="min-h-[44px] px-2 py-2 font-pixel text-[6px] leading-tight transition-all text-center"
                  style={{
                    backgroundColor: active ? '#5A3420' : '#251008',
                    color: active ? '#D4A055' : '#8B7355',
                    border: `2px solid ${active ? '#D4A055' : '#3A2010'}`,
                    boxShadow: active ? 'inset 0 1px 0 rgba(212,160,85,0.15)' : 'none',
                  }}
                >
                  {s.icon} {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Sent / Project toggle ── */}
      <div className="flex gap-2">
        <button
          onClick={() => onChange({ sent: true })}
          className="plank-border flex-1 min-h-[44px] py-2 font-pixel text-[7px] text-center transition-all"
          style={{
            backgroundColor: problem.sent ? '#3D6B35' : '#251008',
            color: problem.sent ? '#F5E6C8' : '#5A5A3A',
            boxShadow: problem.sent ? 'inset 0 1px 0 rgba(100,180,80,0.2)' : 'none',
          }}
        >
          Sent
        </button>
        <button
          onClick={() => onChange({ sent: false })}
          className="plank-border flex-1 min-h-[44px] py-2 font-pixel text-[7px] text-center transition-all"
          style={{
            backgroundColor: !problem.sent ? '#8B2020' : '#251008',
            color: !problem.sent ? '#F5E6C8' : '#5A3A3A',
            boxShadow: !problem.sent ? 'inset 0 1px 0 rgba(180,80,80,0.2)' : 'none',
          }}
        >
          Project
        </button>
      </div>
    </div>
  );
}
