import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import useClimberStore from '../stores/useClimberStore';
import { DISCIPLINES } from '../data/grades';
import { getRank } from '../data/ranks';
import useAudio from '../hooks/useAudio';
import DisciplineCard from './disciplines/DisciplineCard';
import SessionLogger from './session/SessionLogger';
import SessionHistory from './session/SessionHistory';
import LevelUpModal from './ui/LevelUpModal';

const disciplineList = Object.values(DISCIPLINES);

function RopeDivider() {
  return <div className="rope-divider my-5" />;
}

export default function Dashboard() {
  const name = useClimberStore((s) => s.name);
  const highestGradeSent = useClimberStore((s) => s.highestGradeSent);
  const getTotalXP = useClimberStore((s) => s.getTotalXP);
  const { play } = useAudio();
  const [showLogger, setShowLogger] = useState(false);
  const [pendingLevelUps, setPendingLevelUps] = useState(null);

  const rank = getRank(highestGradeSent);
  const totalXP = getTotalXP();

  const handleOpenLogger = () => {
    play('parchment');
    setShowLogger(true);
  };

  const handleLoggerClose = (levelUps) => {
    setShowLogger(false);
    if (levelUps && levelUps.length > 0) {
      play('fanfare');
      setPendingLevelUps(levelUps);
    }
  };

  return (
    <div className="max-w-[420px] mx-auto px-4 py-6">

      {/* ── Tavern sign header ── */}
      <div className="text-center mb-2">
        <h1
          className="font-pixel text-tavern-light text-sm leading-relaxed text-carved tavern-sway"
        >
          ClimbTavern
        </h1>
        <p className="font-body text-xl text-tavern-parchment/70 mt-1 italic">
          The Adventurer's Board
        </p>
      </div>

      <RopeDivider />

      {/* ── Climber info plaque ── */}
      <div
        className="plank-border wood-grain relative p-3 mb-2 flex items-center justify-between"
        style={{ backgroundColor: '#4A2A1A' }}
      >
        {/* Corner nails */}
        <div
          className="absolute top-[6px] left-[6px] w-[6px] h-[6px] border border-pixel-border"
          style={{ background: '#5A3420', boxShadow: 'inset 1px 1px 0 #8B5E3C' }}
        />
        <div
          className="absolute top-[6px] right-[6px] w-[6px] h-[6px] border border-pixel-border"
          style={{ background: '#5A3420', boxShadow: 'inset 1px 1px 0 #8B5E3C' }}
        />
        <div
          className="absolute bottom-[6px] left-[6px] w-[6px] h-[6px] border border-pixel-border"
          style={{ background: '#5A3420', boxShadow: 'inset 1px 1px 0 #8B5E3C' }}
        />
        <div
          className="absolute bottom-[6px] right-[6px] w-[6px] h-[6px] border border-pixel-border"
          style={{ background: '#5A3420', boxShadow: 'inset 1px 1px 0 #8B5E3C' }}
        />

        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{rank.icon}</span>
          <div>
            <p className="font-pixel text-[9px] text-tavern-light leading-tight text-carved">
              {name}
            </p>
            <p className="font-body text-lg text-tavern-parchment/70 leading-tight">
              {rank.title} &middot; {highestGradeSent}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-pixel text-[8px] text-tavern-light text-carved">
            {totalXP} XP
          </p>
        </div>
      </div>

      <RopeDivider />

      {/* ── Quest Lines heading ── */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-pixel text-[9px] text-tavern-parchment/80 tracking-wide text-carved">
          Quest Lines
        </h2>
        <button
          onClick={handleOpenLogger}
          className="plank-border px-4 min-h-[44px] font-pixel text-[8px] text-tavern-parchment transition-all active:scale-95 flex items-center justify-center"
          style={{ backgroundColor: '#3D6B35' }}
        >
          Log Session
        </button>
      </div>

      {/* ── Discipline cards ── */}
      <div className="grid grid-cols-1 gap-5">
        {disciplineList.map((d) => (
          <DisciplineCard key={d.id} discipline={d} />
        ))}
      </div>

      <RopeDivider />

      {/* ── Battle Log heading ── */}
      <div className="mb-4">
        <h2 className="font-pixel text-[9px] text-tavern-parchment/80 tracking-wide text-carved">
          Battle Log
        </h2>
      </div>

      {/* ── Session history ── */}
      <SessionHistory />

      <RopeDivider />

      {/* ── Tavern flavor footer ── */}
      <p className="text-center font-body text-base text-tavern-parchment/30 italic">
        The innkeeper watches you study the board...
      </p>

      {/* ── Session Logger modal ── */}
      <AnimatePresence>
        {showLogger && (
          <SessionLogger onClose={handleLoggerClose} />
        )}
      </AnimatePresence>

      {/* ── Level-Up celebration modal ── */}
      <AnimatePresence>
        {pendingLevelUps && (
          <LevelUpModal
            levelUps={pendingLevelUps}
            onDismiss={() => setPendingLevelUps(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
