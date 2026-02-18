/**
 * Achievement definitions.
 * Each achievement has an id, title (tavern-flavored), description,
 * icon, and a condition function that receives climber stats.
 */
export const ACHIEVEMENTS = [
  // Session milestones
  {
    id: 'first_session',
    title: 'Fresh Face at the Tavern',
    description: 'Log your first climbing session.',
    icon: '\uD83C\uDFAA',
    category: 'sessions',
    check: (stats) => stats.totalSessions >= 1,
  },
  {
    id: 'ten_sessions',
    title: 'Regular at the Bar',
    description: 'Log 10 climbing sessions.',
    icon: '\uD83C\uDF7A',
    category: 'sessions',
    check: (stats) => stats.totalSessions >= 10,
  },
  {
    id: 'fifty_sessions',
    title: 'Tavern Veteran',
    description: 'Log 50 climbing sessions.',
    icon: '\uD83C\uDFC6',
    category: 'sessions',
    check: (stats) => stats.totalSessions >= 50,
  },
  {
    id: 'hundred_sessions',
    title: 'Legend of the Tavern',
    description: 'Log 100 climbing sessions.',
    icon: '\uD83D\uDC51',
    category: 'sessions',
    check: (stats) => stats.totalSessions >= 100,
  },

  // Send milestones
  {
    id: 'first_send',
    title: 'First Blood',
    description: 'Send your first problem.',
    icon: '\u2694\uFE0F',
    category: 'sends',
    check: (stats) => stats.totalSends >= 1,
  },
  {
    id: 'hundred_sends',
    title: 'Centurion',
    description: 'Send 100 problems.',
    icon: '\uD83D\uDEE1\uFE0F',
    category: 'sends',
    check: (stats) => stats.totalSends >= 100,
  },
  {
    id: 'five_hundred_sends',
    title: 'The Boulder God Smiles',
    description: 'Send 500 problems.',
    icon: '\uD83C\uDF1F',
    category: 'sends',
    check: (stats) => stats.totalSends >= 500,
  },

  // Grade milestones
  {
    id: 'send_v1',
    title: 'Squire\'s Trial',
    description: 'Send a V1 problem.',
    icon: '\uD83D\uDEE1\uFE0F',
    category: 'grades',
    check: (stats) => stats.highestGradeIndex >= 2,
  },
  {
    id: 'send_v3',
    title: 'Ranger\'s Mark',
    description: 'Send a V3 problem.',
    icon: '\uD83C\uDF32',
    category: 'grades',
    check: (stats) => stats.highestGradeIndex >= 4,
  },
  {
    id: 'send_v5',
    title: 'Knighted by the Wall',
    description: 'Send a V5 problem.',
    icon: '\uD83D\uDDE1\uFE0F',
    category: 'grades',
    check: (stats) => stats.highestGradeIndex >= 6,
  },
  {
    id: 'send_v7',
    title: 'Hero\'s Ascent',
    description: 'Send a V7 problem.',
    icon: '\uD83C\uDF1F',
    category: 'grades',
    check: (stats) => stats.highestGradeIndex >= 8,
  },

  // Discipline milestones
  {
    id: 'overhang_10',
    title: 'Dragon Slayer Apprentice',
    description: 'Send 10 overhang problems.',
    icon: '\uD83D\uDC32',
    category: 'disciplines',
    check: (stats) => (stats.sendsByDiscipline?.overhang ?? 0) >= 10,
  },
  {
    id: 'slab_10',
    title: 'Monastery Disciple',
    description: 'Send 10 slab problems.',
    icon: '\uD83E\uDDD8',
    category: 'disciplines',
    check: (stats) => (stats.sendsByDiscipline?.slab ?? 0) >= 10,
  },
  {
    id: 'board_10',
    title: 'Forged in Iron',
    description: 'Send 10 board problems.',
    icon: '\uD83D\uDD28',
    category: 'disciplines',
    check: (stats) => (stats.sendsByDiscipline?.board ?? 0) >= 10,
  },

  // Style milestones
  {
    id: 'all_styles',
    title: 'Renaissance Climber',
    description: 'Send at least one problem in every style.',
    icon: '\uD83C\uDFA8',
    category: 'styles',
    check: (stats) =>
      (stats.sendsByStyle?.technical ?? 0) >= 1 &&
      (stats.sendsByStyle?.powerful ?? 0) >= 1 &&
      (stats.sendsByStyle?.comp ?? 0) >= 1 &&
      (stats.sendsByStyle?.oldschool ?? 0) >= 1,
  },

  // Fun / streak
  {
    id: 'five_tankard_session',
    title: 'Best Night at the Tavern',
    description: 'Log a session with a 5-tankard mood rating.',
    icon: '\uD83C\uDF7B',
    category: 'mood',
    check: (stats) => stats.bestMood >= 5,
  },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
);
