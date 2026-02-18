import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSessionStore from '../../stores/useSessionStore';
import useClimberStore from '../../stores/useClimberStore';
import useXP from '../../hooks/useXP';
import useLevelUp from '../../hooks/useLevelUp';
import useAudio from '../../hooks/useAudio';
import {
  DISCIPLINES,
  GRADES,
  GRADE_COLORS,
  STYLES,
  BOARDS,
} from '../../data/grades';
import { GRADE_XP, ATTEMPT_XP_RATIO, SESSION_LOG_BONUS } from '../../data/xpConfig';
import { setSetting } from '../../db/queries';
import ProblemEntry from './ProblemEntry';

const disciplineList = Object.values(DISCIPLINES);
const boardList = Object.values(BOARDS);

const DISCIPLINE_ICONS = {
  normal:   '\uD83E\uDDF5',
  overhang: '\uD83D\uDC32',
  slab:     '\uD83E\uDDD8',
  board:    '\u2692\uFE0F',
};

function calcPreviewXP(problems) {
  let total = SESSION_LOG_BONUS;
  for (const p of problems) {
    const base = GRADE_XP[p.grade] ?? 10;
    total += p.sent ? base : Math.round(base * ATTEMPT_XP_RATIO);
  }
  return total;
}

export default function SessionLogger({ onClose }) {
  const draft = useSessionStore((s) => s.draft);
  const updateDraft = useSessionStore((s) => s.updateDraft);
  const addDraftProblem = useSessionStore((s) => s.addDraftProblem);
  const updateDraftProblem = useSessionStore((s) => s.updateDraftProblem);
  const removeDraftProblem = useSessionStore((s) => s.removeDraftProblem);
  const saveSession = useSessionStore((s) => s.saveSession);
  const { awardProblemXP, awardSessionBonusXP } = useXP();
  const { captureSnapshot, detectLevelUps } = useLevelUp();
  const { play } = useAudio();

  const [saving, setSaving] = useState(false);
  const [boardType, setBoardType] = useState('tension');
  const [boardAngle, setBoardAngle] = useState(20);

  const isBoard = draft.discipline === 'board';
  const previewXP = calcPreviewXP(draft.problems);

  const handleAddProblem = () => {
    addDraftProblem({
      grade: 'VB',
      style: isBoard ? null : 'technical',
      sent: true,
      notes: '',
    });
  };

  const handleSubmit = async () => {
    if (draft.problems.length === 0) return;
    setSaving(true);
    play('coin');

    // Snapshot the draft BEFORE saveSession clears it
    const submittedProblems = [...draft.problems];
    const submittedDiscipline = draft.discipline;

    // If board, store board info in session data
    if (isBoard) {
      const board = boardList.find((b) => b.id === boardType);
      updateDraft({
        boardType,
        boardAngle,
        boardLabel: board?.label ?? boardType,
      });
    }

    // Capture level state BEFORE XP is awarded
    captureSnapshot();

    // Persist session + problems to Dexie (this reloads history & resets draft)
    await saveSession();

    // Award XP for every problem from our snapshot
    for (const p of submittedProblems) {
      await awardProblemXP({
        grade: p.grade,
        discipline: submittedDiscipline,
        style: p.style,
        sent: p.sent,
      });
    }

    // Session log bonus
    await awardSessionBonusXP(submittedDiscipline);

    // Persist highest grade setting
    const highestGrade = useClimberStore.getState().highestGradeSent;
    await setSetting('highestGradeSent', highestGrade);

    // Detect any level-ups that occurred
    const levelUps = detectLevelUps();
    setSaving(false);
    onClose(levelUps);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => onClose(null)}
      />

      {/* Modal panel */}
      <motion.div
        className="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto overflow-x-hidden"
        style={{
          background: `
            radial-gradient(ellipse 70% 30% at 50% 0%, rgba(212,160,85,0.08) 0%, transparent 60%),
            #2C1810
          `,
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        <div className="px-4 pt-5 pb-8">
          {/* ── Header ── */}
          <div className="text-center mb-4">
            <h2 className="font-pixel text-[11px] text-tavern-light text-carved">
              Log a Session
            </h2>
            <p className="font-body text-base text-tavern-parchment/50 italic mt-1">
              The innkeeper slides you a fresh page...
            </p>
          </div>

          <div className="rope-divider mb-5" />

          {/* ── Discipline selector ── */}
          <div className="mb-5">
            <label className="font-pixel text-[8px] text-tavern-parchment/70 block mb-2">
              Discipline
            </label>
            <div className="grid grid-cols-2 gap-2">
              {disciplineList.map((d) => {
                const active = draft.discipline === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => updateDraft({ discipline: d.id })}
                    className="plank-border wood-grain relative p-3 text-center transition-all min-h-[56px] flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: active ? '#5A3420' : '#3D2317',
                      outline: active ? '2px solid #D4A055' : undefined,
                      outlineOffset: active ? '2px' : undefined,
                    }}
                  >
                    <span className="text-xl block leading-none mb-1">
                      {DISCIPLINE_ICONS[d.id]}
                    </span>
                    <span
                      className={`font-pixel text-[8px] leading-tight ${
                        active ? 'text-tavern-light' : 'text-tavern-parchment/60'
                      }`}
                    >
                      {d.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Board options (only when Board selected) ── */}
          <AnimatePresence>
            {isBoard && (
              <motion.div
                className="mb-5"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="font-pixel text-[8px] text-tavern-parchment/70 block mb-2">
                  Board
                </label>
                <div className="flex gap-2 mb-3">
                  {boardList.map((b) => {
                    const active = boardType === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setBoardType(b.id);
                          setBoardAngle(b.defaultAngle);
                        }}
                        className="plank-border flex-1 min-h-[44px] py-2 px-1 text-center flex items-center justify-center"
                        style={{
                          backgroundColor: active ? '#5A3420' : '#3D2317',
                          outline: active ? '2px solid #D4A055' : undefined,
                          outlineOffset: active ? '2px' : undefined,
                        }}
                      >
                        <span
                          className={`font-pixel text-[7px] leading-tight ${
                            active ? 'text-tavern-light' : 'text-tavern-parchment/50'
                          }`}
                        >
                          {b.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-pixel text-[7px] text-tavern-parchment/60">
                    Angle
                  </label>
                  <div className="plank-border flex items-center" style={{ backgroundColor: '#251008' }}>
                    <button
                      onClick={() => setBoardAngle(Math.max(0, boardAngle - 5))}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center font-body text-xl text-tavern-light"
                    >
                      -
                    </button>
                    <span className="font-pixel text-[9px] text-tavern-parchment px-2 min-w-[36px] text-center">
                      {boardAngle}&deg;
                    </span>
                    <button
                      onClick={() => setBoardAngle(Math.min(70, boardAngle + 5))}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center font-body text-xl text-tavern-light"
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Mood tankards ── */}
          <div className="mb-5">
            <label className="font-pixel text-[8px] text-tavern-parchment/70 block mb-2">
              Mood
            </label>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= draft.mood;
                return (
                  <button
                    key={n}
                    onClick={() => updateDraft({ mood: n })}
                    className="relative text-2xl px-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title={`${n} tankard${n > 1 ? 's' : ''}`}
                  >
                    {/* Dimmed base layer */}
                    <span
                      className="block transition-transform duration-200"
                      style={{
                        filter: active ? 'none' : 'grayscale(1) brightness(0.4)',
                        transform: active ? 'scale(1.1)' : 'scale(0.9)',
                      }}
                    >
                      {'\uD83C\uDF7A'}
                    </span>
                    {/* Amber glow behind active tankards */}
                    {active && (
                      <span
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{
                          filter: 'blur(4px) brightness(1.4)',
                          opacity: 0.3,
                          animation: `tankard-fill 0.3s ease-out ${(n - 1) * 0.06}s both`,
                        }}
                      >
                        {'\uD83C\uDF7A'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-center font-body text-sm text-tavern-parchment/40 mt-1">
              {draft.mood === 1 && 'Rough night at the tavern...'}
              {draft.mood === 2 && 'Could have been better.'}
              {draft.mood === 3 && 'A decent session.'}
              {draft.mood === 4 && 'The bard plays a merry tune!'}
              {draft.mood === 5 && 'By the boulder god \u2014 glorious!'}
            </p>
          </div>

          <div className="rope-divider mb-5" />

          {/* ── Problems list ── */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="font-pixel text-[8px] text-tavern-parchment/70">
                Problems ({draft.problems.length})
              </label>
              <button
                onClick={handleAddProblem}
                className="plank-border px-4 min-h-[44px] font-pixel text-[7px] text-tavern-light flex items-center justify-center"
                style={{ backgroundColor: '#3D6B35' }}
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {draft.problems.map((problem, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProblemEntry
                      index={i}
                      problem={problem}
                      discipline={draft.discipline}
                      onChange={(changes) => updateDraftProblem(i, changes)}
                      onRemove={() => removeDraftProblem(i)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {draft.problems.length === 0 && (
              <p className="text-center font-body text-base text-tavern-parchment/30 italic py-6">
                No problems yet. Tap "+ Add" to begin your quest.
              </p>
            )}
          </div>

          {/* ── XP Preview ── */}
          {draft.problems.length > 0 && (
            <div
              className="plank-border p-3 mb-5 text-center"
              style={{ backgroundColor: '#2A1508' }}
            >
              <p className="font-body text-base text-tavern-parchment/60">
                This session will earn you
              </p>
              <p className="font-pixel text-[11px] text-tavern-light text-carved mt-1">
                +{previewXP} XP
              </p>
              <p className="font-body text-xs text-tavern-parchment/30 mt-1">
                (includes +{SESSION_LOG_BONUS} session bonus)
              </p>
            </div>
          )}

          <div className="rope-divider mb-5" />

          {/* ── Submit ── */}
          <div className="flex gap-3">
            <button
              onClick={() => onClose(null)}
              className="plank-border flex-1 min-h-[48px] py-3 font-pixel text-[8px] text-tavern-parchment/60"
              style={{ backgroundColor: '#3D2317' }}
            >
              Walk Away
            </button>
            <button
              onClick={handleSubmit}
              disabled={draft.problems.length === 0 || saving}
              className="plank-border flex-1 min-h-[48px] py-3 font-pixel text-[8px] transition-all disabled:opacity-40"
              style={{
                backgroundColor: draft.problems.length > 0 ? '#3D6B35' : '#3D2317',
                color: draft.problems.length > 0 ? '#F5E6C8' : undefined,
              }}
            >
              {saving ? 'Writing...' : 'Close the Tab'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
