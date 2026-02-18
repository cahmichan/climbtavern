import useClimberStore from '../stores/useClimberStore';
import { addXPEntry } from '../db/queries';
import { GRADE_XP, ATTEMPT_XP_RATIO, SESSION_LOG_BONUS } from '../data/xpConfig';
import { GRADE_INDEX } from '../data/grades';

/**
 * Hook for all XP mutations. All XP changes flow through here.
 */
export default function useXP() {
  const addDisciplineXP = useClimberStore((s) => s.addDisciplineXP);
  const addStyleXP = useClimberStore((s) => s.addStyleXP);
  const setHighestGrade = useClimberStore((s) => s.setHighestGrade);
  const highestGradeSent = useClimberStore((s) => s.highestGradeSent);

  /**
   * Award XP for a single problem attempt/send.
   */
  const awardProblemXP = async ({ grade, discipline, style, sent }) => {
    const baseXP = GRADE_XP[grade] ?? 10;
    const amount = sent ? baseXP : Math.round(baseXP * ATTEMPT_XP_RATIO);

    // Discipline XP
    addDisciplineXP(discipline, amount);
    await addXPEntry({
      timestamp: Date.now(),
      discipline,
      style: style ?? null,
      amount,
      reason: sent ? `send:${grade}` : `attempt:${grade}`,
    });

    // Style XP (only for non-board disciplines)
    if (style && discipline !== 'board') {
      addStyleXP(style, amount);
      await addXPEntry({
        timestamp: Date.now(),
        discipline: null,
        style,
        amount,
        reason: sent ? `style-send:${grade}` : `style-attempt:${grade}`,
      });
    }

    // Update highest grade
    if (sent) {
      const currentIdx = GRADE_INDEX[highestGradeSent] ?? 0;
      const newIdx = GRADE_INDEX[grade] ?? 0;
      if (newIdx > currentIdx) {
        setHighestGrade(grade);
      }
    }
  };

  /**
   * Award session log bonus XP.
   */
  const awardSessionBonusXP = async (discipline) => {
    addDisciplineXP(discipline, SESSION_LOG_BONUS);
    await addXPEntry({
      timestamp: Date.now(),
      discipline,
      style: null,
      amount: SESSION_LOG_BONUS,
      reason: 'session-bonus',
    });
  };

  return { awardProblemXP, awardSessionBonusXP };
}
