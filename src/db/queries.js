import db from './database';

// ── Sessions ──

export async function getAllSessions() {
  return db.sessions.orderBy('date').reverse().toArray();
}

export async function getSessionById(id) {
  return db.sessions.get(id);
}

export async function addSession(session) {
  return db.sessions.add(session);
}

export async function updateSession(id, changes) {
  return db.sessions.update(id, changes);
}

export async function deleteSession(id) {
  await db.problems.where('sessionId').equals(id).delete();
  await db.xp_log.where('reason').equals(`session:${id}`).delete();
  return db.sessions.delete(id);
}

// ── Problems ──

export async function getProblemsForSession(sessionId) {
  return db.problems.where('sessionId').equals(sessionId).toArray();
}

export async function addProblem(problem) {
  return db.problems.add(problem);
}

export async function updateProblem(id, changes) {
  return db.problems.update(id, changes);
}

export async function deleteProblem(id) {
  return db.problems.delete(id);
}

export async function getAllProblems() {
  return db.problems.toArray();
}

// ── XP Log ──

export async function addXPEntry(entry) {
  return db.xp_log.add(entry);
}

export async function getXPLog() {
  return db.xp_log.orderBy('timestamp').toArray();
}

export async function getTotalXPByDiscipline(discipline) {
  const entries = await db.xp_log.where('discipline').equals(discipline).toArray();
  return entries.reduce((sum, e) => sum + e.amount, 0);
}

// ── Settings ──

export async function getSetting(key) {
  const row = await db.settings.get(key);
  return row?.value;
}

export async function setSetting(key, value) {
  return db.settings.put({ key, value });
}
