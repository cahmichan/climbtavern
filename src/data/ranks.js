export const RANKS = {
  VB:    { title: 'Peasant',     icon: '\uD83C\uDF3E' },
  V0:    { title: 'Stable Hand', icon: '\uD83D\uDC34' },
  V1:    { title: 'Squire',      icon: '\uD83D\uDEE1\uFE0F' },
  V2:    { title: 'Scout',       icon: '\uD83C\uDFF9' },
  V3:    { title: 'Ranger',      icon: '\uD83C\uDF32' },
  V4:    { title: 'Warrior',     icon: '\u2694\uFE0F' },
  V5:    { title: 'Knight',      icon: '\uD83D\uDDE1\uFE0F' },
  V6:    { title: 'Champion',    icon: '\uD83D\uDC51' },
  V7:    { title: 'Hero',        icon: '\uD83C\uDF1F' },
  'V8+': { title: 'Legend',      icon: '\uD83D\uDC09' },
};

/**
 * Get the rank for a given grade string.
 */
export function getRank(grade) {
  return RANKS[grade] ?? RANKS.VB;
}
