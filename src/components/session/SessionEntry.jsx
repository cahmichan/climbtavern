import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISCIPLINES, GRADE_COLORS, STYLES } from '../../data/grades';
import { GRADE_XP, ATTEMPT_XP_RATIO, SESSION_LOG_BONUS } from '../../data/xpConfig';

const DISCIPLINE_ICONS = {
  normal:   '\uD83E\uDDF5',
  overhang: '\uD83D\uDC32',
  slab:     '\uD83E\uDDD8',
  board:    '\u2692\uFE0F',
};

const STYLE_MAP = Object.fromEntries(
  Object.values(STYLES).map((s) => [s.id, s])
);

const DISCIPLINE_MAP = Object.fromEntries(
  Object.values(DISCIPLINES).map((d) => [d.id, d])
);

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const suffix =
    day === 1 || day === 21 || day === 31 ? 'st' :
    day === 2 || day === 22 ? 'nd' :
    day === 3 || day === 23 ? 'rd' : 'th';
  return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
}

function calcSessionXP(problems) {
  let total = SESSION_LOG_BONUS;
  for (const p of problems) {
    const base = GRADE_XP[p.grade] ?? 10;
    total += p.sent ? base : Math.round(base * ATTEMPT_XP_RATIO);
  }
  return total;
}

export default function SessionEntry({ session }) {
  const [expanded, setExpanded] = useState(false);

  const problems = session.problems ?? [];
  const sends = problems.filter((p) => p.sent).length;
  const total = problems.length;
  const xp = calcSessionXP(problems);
  const discIcon = DISCIPLINE_ICONS[session.discipline] ?? '\u2694\uFE0F';
  const discLabel = DISCIPLINE_MAP[session.discipline]?.label ?? session.discipline;

  return (
    <div
      className="plank-border wood-grain relative"
      style={{ backgroundColor: '#3D2317' }}
    >
      {/* ── Collapsed header (always visible, tappable) ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-3 flex items-start gap-3"
      >
        {/* Left: date + discipline */}
        <div className="flex-1 min-w-0">
          {/* Date line */}
          <p className="font-body text-sm text-tavern-parchment/40 leading-tight">
            {formatDate(session.date)}
          </p>

          {/* Discipline label with icon */}
          <p className="font-pixel text-[9px] text-tavern-light text-carved leading-tight mt-1 flex items-center gap-1.5">
            <span className="text-base leading-none">{discIcon}</span>
            {discLabel}
          </p>

          {/* Mood tankards */}
          <div className="flex gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className="text-sm leading-none"
                style={{
                  filter: n <= (session.mood ?? 0)
                    ? 'none'
                    : 'grayscale(1) brightness(0.3)',
                }}
              >
                {'\uD83C\uDF7A'}
              </span>
            ))}
          </div>
        </div>

        {/* Right: stats column */}
        <div className="text-right shrink-0">
          {/* Problems count */}
          <p className="font-body text-base text-tavern-parchment/70 leading-tight">
            <span className="text-tavern-green">{sends}</span>
            <span className="text-tavern-parchment/30"> / {total}</span>
          </p>
          <p className="font-body text-xs text-tavern-parchment/30 leading-tight">
            sent
          </p>

          {/* XP earned */}
          <p className="font-pixel text-[8px] text-tavern-light mt-1.5 leading-tight">
            +{xp} XP
          </p>

          {/* Expand indicator */}
          <span
            className="inline-block font-body text-sm text-tavern-parchment/30 mt-1 transition-transform"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            {'\u25BC'}
          </span>
        </div>
      </button>

      {/* ── Expanded problem details ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Inner divider */}
            <div
              className="mx-3 h-[2px]"
              style={{
                background:
                  'repeating-linear-gradient(90deg, #5A3420 0px, #5A3420 3px, transparent 3px, transparent 6px)',
              }}
            />

            <div className="p-3 pt-2 space-y-2">
              {problems.length === 0 ? (
                <p className="font-body text-sm text-tavern-parchment/30 italic">
                  No problems recorded for this session.
                </p>
              ) : (
                problems.map((p, i) => {
                  const gradeColor = GRADE_COLORS[p.grade] ?? '#999';
                  const isDarkGrade = ['V7', 'V8+'].includes(p.grade);
                  const style = p.style ? STYLE_MAP[p.style] : null;

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-2 py-1.5"
                      style={{
                        backgroundColor: '#2A1508',
                        border: '2px solid #1a0a05',
                        boxShadow: '2px 0 0 #1a0a05, -2px 0 0 #1a0a05, 0 2px 0 #1a0a05, 0 -2px 0 #1a0a05',
                      }}
                    >
                      {/* Problem number */}
                      <span className="font-body text-xs text-tavern-parchment/25 w-4 shrink-0">
                        {i + 1}.
                      </span>

                      {/* Grade badge */}
                      <span
                        className="font-pixel text-[7px] px-1.5 py-0.5 leading-none shrink-0"
                        style={{
                          backgroundColor: gradeColor,
                          color: isDarkGrade ? '#F5E6C8' : '#1a0a05',
                          border: '2px solid #1a0a05',
                          boxShadow: `0 0 4px ${gradeColor}40`,
                        }}
                      >
                        {p.grade}
                      </span>

                      {/* Style tag (if present) */}
                      {style && (
                        <span className="font-body text-sm text-tavern-parchment/50 truncate">
                          {style.icon} {style.label}
                        </span>
                      )}

                      {/* Spacer */}
                      <span className="flex-1" />

                      {/* Sent / Project */}
                      <span
                        className="font-pixel text-[6px] px-1.5 py-0.5 leading-none shrink-0"
                        style={{
                          backgroundColor: p.sent ? '#3D6B35' : '#8B2020',
                          color: '#F5E6C8',
                          border: '2px solid #1a0a05',
                        }}
                      >
                        {p.sent ? 'SENT' : 'PROJ'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
