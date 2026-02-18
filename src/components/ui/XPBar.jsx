import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function XPBar({ currentXP, requiredXP, level, maxLevel }) {
  const isMaxed = level >= maxLevel;
  const percent = isMaxed ? 100 : requiredXP > 0 ? (currentXP / requiredXP) * 100 : 0;
  const clampedPercent = Math.min(percent, 100);

  // Spring-driven width that transitions smoothly between any value changes
  const rawWidth = useMotionValue(0);
  const springWidth = useSpring(rawWidth, { damping: 25, stiffness: 120 });
  const widthPercent = useTransform(springWidth, (v) => `${v}%`);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      rawWidth.set(0);
      const raf = requestAnimationFrame(() => rawWidth.set(clampedPercent));
      hasMounted.current = true;
      return () => cancelAnimationFrame(raf);
    }
    rawWidth.set(clampedPercent);
  }, [clampedPercent, rawWidth]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="font-pixel text-[8px] text-tavern-light">
          LV {level}
        </span>
        <span className="font-body text-base text-tavern-parchment">
          {isMaxed ? 'MAX' : `${currentXP} / ${requiredXP}`}
        </span>
      </div>

      {/* Barrel track */}
      <div
        className="relative h-6 overflow-hidden"
        style={{
          border: '3px solid #1a0a05',
          boxShadow:
            'inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(0,0,0,0.3), 3px 0 0 #1a0a05, -3px 0 0 #1a0a05, 0 3px 0 #1a0a05, 0 -3px 0 #1a0a05',
          backgroundColor: '#251008',
        }}
      >
        {/* Barrel stave lines */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 5px, #1a0a05 5px, #1a0a05 6px)',
          }}
        />

        {/* Metal bands */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #3A2010, #5A3420, #3A2010)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #3A2010, #5A3420, #3A2010)' }}
        />

        {/* Amber mead fill */}
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            width: widthPercent,
            background: `linear-gradient(
              180deg,
              #F0C850 0%,
              #E8B84B 15%,
              #D4A035 50%,
              #B8862D 85%,
              #A07025 100%
            )`,
            boxShadow: 'inset 0 1px 0 rgba(255,230,150,0.3)',
          }}
        />

        {/* Froth highlight */}
        <motion.div
          className="absolute top-[2px] left-0 h-[3px] pointer-events-none"
          style={{
            width: widthPercent,
            background: 'linear-gradient(90deg, rgba(245,230,200,0.5), rgba(245,230,200,0.15))',
          }}
        />

        {/* Bubble dots */}
        <motion.div
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            width: widthPercent,
            backgroundImage: `
              radial-gradient(circle 1px, rgba(255,255,200,0.25) 0%, transparent 100%),
              radial-gradient(circle 1px, rgba(255,255,200,0.15) 0%, transparent 100%)
            `,
            backgroundSize: '12px 10px, 18px 14px',
            backgroundPosition: '3px 2px, 9px 6px',
          }}
        />

        {/* Candlelit shimmer sweep */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,240,0.12) 50%, transparent 70%)',
              animation: 'mead-shimmer 3s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
