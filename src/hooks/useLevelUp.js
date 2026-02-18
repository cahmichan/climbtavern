import { useRef, useCallback } from 'react';
import useClimberStore from '../stores/useClimberStore';
import { computeLevel, MAX_DISCIPLINE_LEVEL, MAX_STYLE_LEVEL } from '../data/xpConfig';
import { DISCIPLINE_IDS, STYLE_IDS } from '../data/grades';

/**
 * Hook to detect level-up events by comparing before/after XP snapshots.
 *
 * Usage:
 *   const { captureSnapshot, detectLevelUps } = useLevelUp();
 *   captureSnapshot();            // before XP changes
 *   await awardProblemXP(...);    // XP mutations
 *   const ups = detectLevelUps(); // array of { discipline|style, oldLevel, newLevel }
 */
export default function useLevelUp() {
  const snapshotRef = useRef(null);

  const captureSnapshot = useCallback(() => {
    const { disciplineXP, styleXP } = useClimberStore.getState();
    const levels = {};

    for (const id of DISCIPLINE_IDS) {
      levels[`d:${id}`] = computeLevel(disciplineXP[id] ?? 0, MAX_DISCIPLINE_LEVEL).level;
    }
    for (const id of STYLE_IDS) {
      levels[`s:${id}`] = computeLevel(styleXP[id] ?? 0, MAX_STYLE_LEVEL).level;
    }

    snapshotRef.current = levels;
  }, []);

  const detectLevelUps = useCallback(() => {
    if (!snapshotRef.current) return [];

    const { disciplineXP, styleXP } = useClimberStore.getState();
    const levelUps = [];

    for (const id of DISCIPLINE_IDS) {
      const oldLevel = snapshotRef.current[`d:${id}`] ?? 0;
      const newLevel = computeLevel(disciplineXP[id] ?? 0, MAX_DISCIPLINE_LEVEL).level;
      if (newLevel > oldLevel) {
        levelUps.push({ discipline: id, oldLevel, newLevel });
      }
    }

    for (const id of STYLE_IDS) {
      const oldLevel = snapshotRef.current[`s:${id}`] ?? 0;
      const newLevel = computeLevel(styleXP[id] ?? 0, MAX_STYLE_LEVEL).level;
      if (newLevel > oldLevel) {
        levelUps.push({ style: id, discipline: null, oldLevel, newLevel });
      }
    }

    snapshotRef.current = null;
    return levelUps;
  }, []);

  return { captureSnapshot, detectLevelUps };
}
