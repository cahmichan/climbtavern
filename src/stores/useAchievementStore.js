import { create } from 'zustand';
import { ACHIEVEMENTS } from '../data/achievements';
import { GRADE_INDEX } from '../data/grades';
import { getSetting, setSetting } from '../db/queries';

/**
 * Achievement store — tracks which achievements are unlocked.
 *
 * unlocked: Set of achievement IDs (stored as array for serialization)
 * newlyUnlocked: achievements just earned this check cycle (for celebration UI)
 */
const useAchievementStore = create((set, get) => ({
  unlocked: [],
  newlyUnlocked: [],

  // ── Actions ──

  /**
   * Check all achievements against current stats.
   * Stats shape: {
   *   totalSessions, totalSends, highestGradeIndex,
   *   sendsByDiscipline: { normal, overhang, slab, board },
   *   sendsByStyle: { technical, powerful, comp, oldschool },
   *   bestMood,
   * }
   */
  checkAchievements: (stats) => {
    const { unlocked } = get();
    const unlockedSet = new Set(unlocked);
    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedSet.has(achievement.id)) continue;
      if (achievement.check(stats)) {
        unlockedSet.add(achievement.id);
        newlyUnlocked.push(achievement);
      }
    }

    if (newlyUnlocked.length > 0) {
      const updated = [...unlockedSet];
      set({ unlocked: updated, newlyUnlocked });
      setSetting('unlockedAchievements', updated);
    }
  },

  clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),

  // ── Hydrate from Dexie ──

  hydrate: async () => {
    const unlocked = (await getSetting('unlockedAchievements')) ?? [];
    set({ unlocked, newlyUnlocked: [] });
  },

  // ── Helpers ──

  isUnlocked: (id) => get().unlocked.includes(id),

  getProgress: () => {
    const { unlocked } = get();
    return {
      total: ACHIEVEMENTS.length,
      earned: unlocked.length,
      percent: Math.round((unlocked.length / ACHIEVEMENTS.length) * 100),
    };
  },
}));

export default useAchievementStore;
