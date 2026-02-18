import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISCIPLINES, STYLES } from '../../data/grades';

const DISCIPLINE_MAP = Object.fromEntries(
  Object.values(DISCIPLINES).map((d) => [d.id, d])
);

const STYLE_MAP = Object.fromEntries(
  Object.values(STYLES).map((s) => [s.id, s])
);

const DISCIPLINE_ICONS = {
  normal:   '\uD83E\uDDF5',
  overhang: '\uD83D\uDC32',
  slab:     '\uD83E\uDDD8',
  board:    '\u2692\uFE0F',
};

const FLAVOR_TEXTS = [
  'By the beard of the boulder god \u2014 you\'ve grown stronger!',
  'The innkeeper chalks your name higher on the board...',
  'The tavern erupts in cheer! A new rank is earned!',
  'The bard in the corner strums a triumphant chord!',
  'Even the old regulars raise a tankard in your honor!',
];

function generateParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i + (Math.random() * 20 - 10);
    const distance = 80 + Math.random() * 100;
    const rad = (angle * Math.PI) / 180;
    particles.push({
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.3,
      color: Math.random() > 0.4 ? '#F0C850' : '#D4A055',
    });
  }
  return particles;
}

/**
 * Level-up celebration modal.
 * Props:
 *   levelUps: array of { discipline?, style?, oldLevel, newLevel }
 *   onDismiss: callback to close
 */
export default function LevelUpModal({ levelUps, onDismiss }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [particles] = useState(() => generateParticles(28));

  const current = levelUps[currentIndex];
  if (!current) return null;

  // Determine if this is a discipline or style level-up
  const isStyleLevelUp = !current.discipline && current.style;
  const label = isStyleLevelUp
    ? STYLE_MAP[current.style]?.label ?? current.style
    : DISCIPLINE_MAP[current.discipline]?.label ?? current.discipline;
  const icon = isStyleLevelUp
    ? STYLE_MAP[current.style]?.icon ?? '\u2728'
    : DISCIPLINE_ICONS[current.discipline] ?? '\u2694\uFE0F';
  const subtitle = isStyleLevelUp
    ? STYLE_MAP[current.style]?.school ?? ''
    : DISCIPLINE_MAP[current.discipline]?.metaphor ?? '';

  const flavor = FLAVOR_TEXTS[current.newLevel % FLAVOR_TEXTS.length];
  const isLast = currentIndex >= levelUps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onDismiss();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dark overlay with amber tint */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212,160,85,0.12) 0%, rgba(0,0,0,0.85) 70%)',
        }}
        onClick={handleNext}
      />

      {/* Center content — keyed so it remounts per level-up for fresh animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="relative z-10 max-w-[340px] w-full mx-4 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
        >
          {/* ── Particle burst ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  border: '1px solid #1a0a05',
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: [1, 1, 0],
                  scale: [0, 1.2, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* ── Star burst behind icon ── */}
          <motion.div
            className="mx-auto mb-4 relative w-24 h-24 flex items-center justify-center"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(240,200,80,0.3), transparent, rgba(240,200,80,0.15), transparent)',
                filter: 'blur(2px)',
              }}
            />
          </motion.div>

          {/* Icon */}
          <motion.div
            className="text-5xl leading-none mb-3 -mt-20 relative z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 150, delay: 0.2 }}
          >
            {icon}
          </motion.div>

          {/* "LEVEL UP!" */}
          <motion.h2
            className="font-pixel text-[14px] text-tavern-light text-carved leading-relaxed mb-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            LEVEL UP!
          </motion.h2>

          {/* Label + level transition */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-pixel text-[10px] text-tavern-parchment mb-0.5">
              {label}
            </p>
            {subtitle && (
              <p className="font-body text-sm text-tavern-parchment/40 italic mb-2">
                {subtitle}
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <span className="font-pixel text-[18px] text-tavern-parchment/40">
                {current.oldLevel}
              </span>
              <motion.span
                className="font-body text-2xl text-tavern-light"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ delay: 0.65, duration: 0.4 }}
              >
                {'\u2192'}
              </motion.span>
              <motion.span
                className="font-pixel text-[22px] text-tavern-light"
                style={{
                  textShadow: '0 0 12px rgba(240,200,80,0.6), 0 0 24px rgba(240,200,80,0.3)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1] }}
                transition={{ delay: 0.75, duration: 0.4 }}
              >
                {current.newLevel}
              </motion.span>
            </div>
          </motion.div>

          {/* Flavor text */}
          <motion.p
            className="font-body text-base text-tavern-parchment/50 italic mt-4 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            {flavor}
          </motion.p>

          {/* Continue button */}
          <motion.button
            onClick={handleNext}
            className="plank-border mt-6 px-6 py-2 font-pixel text-[8px] text-tavern-parchment"
            style={{ backgroundColor: '#3D6B35' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {isLast ? 'Back to Tavern' : 'Next'}
          </motion.button>

          {/* Multi level-up counter */}
          {levelUps.length > 1 && (
            <motion.p
              className="font-body text-xs text-tavern-parchment/30 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {currentIndex + 1} / {levelUps.length}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
