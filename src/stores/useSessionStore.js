import { create } from 'zustand';
import { getAllSessions, getProblemsForSession, addSession, addProblem } from '../db/queries';

/**
 * Session store — manages session logging state and history.
 *
 * sessions: array of past sessions (loaded from Dexie)
 * draft: the in-progress session being logged
 */
const useSessionStore = create((set, get) => ({
  // Loaded session history
  sessions: [],
  loading: false,

  // Draft session for the logger
  draft: {
    date: new Date().toISOString().slice(0, 10),
    discipline: 'normal',
    location: 'Camp5 Malaysia',
    mood: 3,
    notes: '',
    problems: [],
  },

  // ── Draft actions ──

  updateDraft: (changes) =>
    set((state) => ({
      draft: { ...state.draft, ...changes },
    })),

  addDraftProblem: (problem) =>
    set((state) => ({
      draft: {
        ...state.draft,
        problems: [...state.draft.problems, problem],
      },
    })),

  updateDraftProblem: (index, changes) =>
    set((state) => {
      const problems = [...state.draft.problems];
      problems[index] = { ...problems[index], ...changes };
      return { draft: { ...state.draft, problems } };
    }),

  removeDraftProblem: (index) =>
    set((state) => {
      const problems = state.draft.problems.filter((_, i) => i !== index);
      return { draft: { ...state.draft, problems } };
    }),

  resetDraft: () =>
    set({
      draft: {
        date: new Date().toISOString().slice(0, 10),
        discipline: 'normal',
        location: 'Camp5 Malaysia',
        mood: 3,
        notes: '',
        problems: [],
      },
    }),

  // ── Persistence ──

  saveSession: async () => {
    const { draft } = get();
    const { problems, ...sessionData } = draft;

    const sessionId = await addSession({
      ...sessionData,
      createdAt: Date.now(),
    });

    for (const problem of problems) {
      await addProblem({ ...problem, sessionId });
    }

    // Reload history and reset draft
    await get().loadSessions();
    get().resetDraft();

    return sessionId;
  },

  loadSessions: async () => {
    set({ loading: true });
    const sessions = await getAllSessions();

    // Attach problems to each session
    const sessionsWithProblems = await Promise.all(
      sessions.map(async (s) => ({
        ...s,
        problems: await getProblemsForSession(s.id),
      }))
    );

    set({ sessions: sessionsWithProblems, loading: false });
  },
}));

export default useSessionStore;
