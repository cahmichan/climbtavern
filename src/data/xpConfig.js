/**
 * XP awarded for sending a problem at each grade.
 * Attempting without sending awards 20% of these values.
 */
export const GRADE_XP = {
  VB:    10,
  V0:    15,
  V1:    25,
  V2:    40,
  V3:    60,
  V4:    85,
  V5:    115,
  V6:    150,
  V7:    190,
  'V8+': 200,
};

/** Flat XP bonus for logging any session. */
export const SESSION_LOG_BONUS = 25;

/** XP multiplier for attempts (not sends). */
export const ATTEMPT_XP_RATIO = 0.2;

/** Max discipline level. */
export const MAX_DISCIPLINE_LEVEL = 50;

/** Max style level. */
export const MAX_STYLE_LEVEL = 20;

/**
 * Calculate XP required to reach a given level.
 * Follows a soft curve: level * 100 + level^2 * 10
 */
export function xpRequiredForLevel(level) {
  return level * 100 + level * level * 10;
}

/**
 * Given total XP, compute current level and progress toward next level.
 * Returns { level, currentXP, requiredXP, overflow }
 */
export function computeLevel(totalXP, maxLevel) {
  let remaining = totalXP;
  let level = 0;

  while (level < maxLevel) {
    const needed = xpRequiredForLevel(level + 1);
    if (remaining < needed) {
      return {
        level,
        currentXP: remaining,
        requiredXP: needed,
        overflow: 0,
      };
    }
    remaining -= needed;
    level++;
  }

  return {
    level: maxLevel,
    currentXP: 0,
    requiredXP: 0,
    overflow: remaining,
  };
}
