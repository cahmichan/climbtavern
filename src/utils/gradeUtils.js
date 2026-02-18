import { GRADES, GRADE_INDEX, GRADE_COLORS } from '../data/grades';

/**
 * Parse a grade string and return its index, or -1 if invalid.
 */
export function parseGrade(grade) {
  return GRADE_INDEX[grade] ?? -1;
}

/**
 * Compare two grade strings. Returns negative if a < b, 0 if equal, positive if a > b.
 */
export function compareGrades(a, b) {
  return parseGrade(a) - parseGrade(b);
}

/**
 * Get the color associated with a grade.
 */
export function gradeColor(grade) {
  return GRADE_COLORS[grade] ?? '#999999';
}

/**
 * Check if a grade string is valid.
 */
export function isValidGrade(grade) {
  return GRADE_INDEX[grade] !== undefined;
}

/**
 * Get the next grade up, or null if already at max.
 */
export function nextGrade(grade) {
  const idx = parseGrade(grade);
  if (idx < 0 || idx >= GRADES.length - 1) return null;
  return GRADES[idx + 1];
}
