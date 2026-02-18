import { create } from 'zustand';
import { DISCIPLINE_IDS, STYLE_IDS } from '../data/grades';
import { computeLevel, MAX_DISCIPLINE_LEVEL, MAX_STYLE_LEVEL } from '../data/xpConfig';
import { getXPLog, getSetting } from '../db/queries';

/**
 * Climber store — profile, XP totals, and computed levels.
 *
 * Shape:
 *   name: string
 *   homeGym: string
 *   defaultBoard: { id, angle }
 *   disciplineXP: { normal: 0, overhang: 0, slab: 0, board: 0 }
 *   styleXP: { technical: 0, powerful: 0, comp: 0, oldschool: 0 }
 *   highestGradeSent: 'VB'
 */
const useClimberStore = create((set, get) => ({
  // Profile
  name: 'Adventurer',
  homeGym: 'Camp5 Malaysia',
  defaultBoard: { id: 'tension', angle: 20 },

  // XP pools
  disciplineXP: Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, 0])),
  styleXP: Object.fromEntries(STYLE_IDS.map((s) => [s, 0])),

  // Tracking
  highestGradeSent: 'VB',

  // ── Actions ──

  setProfile: ({ name, homeGym, defaultBoard }) =>
    set((state) => ({
      name: name ?? state.name,
      homeGym: homeGym ?? state.homeGym,
      defaultBoard: defaultBoard ?? state.defaultBoard,
    })),

  addDisciplineXP: (discipline, amount) =>
    set((state) => ({
      disciplineXP: {
        ...state.disciplineXP,
        [discipline]: (state.disciplineXP[discipline] ?? 0) + amount,
      },
    })),

  addStyleXP: (style, amount) =>
    set((state) => ({
      styleXP: {
        ...state.styleXP,
        [style]: (state.styleXP[style] ?? 0) + amount,
      },
    })),

  setHighestGrade: (grade) => set({ highestGradeSent: grade }),

  // ── Computed helpers ──

  getDisciplineLevel: (discipline) => {
    const xp = get().disciplineXP[discipline] ?? 0;
    return computeLevel(xp, MAX_DISCIPLINE_LEVEL);
  },

  getStyleLevel: (style) => {
    const xp = get().styleXP[style] ?? 0;
    return computeLevel(xp, MAX_STYLE_LEVEL);
  },

  getTotalXP: () => {
    const { disciplineXP, styleXP } = get();
    const dTotal = Object.values(disciplineXP).reduce((a, b) => a + b, 0);
    const sTotal = Object.values(styleXP).reduce((a, b) => a + b, 0);
    return dTotal + sTotal;
  },

  // ── Hydrate from Dexie on app load ──

  hydrate: async () => {
    // Rebuild XP from log
    const xpLog = await getXPLog();
    const disciplineXP = Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, 0]));
    const styleXP = Object.fromEntries(STYLE_IDS.map((s) => [s, 0]));

    for (const entry of xpLog) {
      if (entry.discipline && disciplineXP[entry.discipline] !== undefined) {
        disciplineXP[entry.discipline] += entry.amount;
      }
      if (entry.style && styleXP[entry.style] !== undefined) {
        styleXP[entry.style] += entry.amount;
      }
    }

    // Load settings
    const name = (await getSetting('name')) ?? 'Adventurer';
    const homeGym = (await getSetting('homeGym')) ?? 'Camp5 Malaysia';
    const defaultBoard = (await getSetting('defaultBoard')) ?? { id: 'tension', angle: 20 };
    const highestGradeSent = (await getSetting('highestGradeSent')) ?? 'VB';

    set({ name, homeGym, defaultBoard, highestGradeSent, disciplineXP, styleXP });
  },
}));

export default useClimberStore;
