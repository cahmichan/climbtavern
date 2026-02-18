import Dexie from 'dexie';

const db = new Dexie('ClimbTavern');

db.version(1).stores({
  sessions: '++id, date, discipline, location, mood',
  problems: '++id, sessionId, grade, style, sent, notes',
  xp_log:   '++id, timestamp, discipline, style, amount, reason',
  settings: 'key',
});

export default db;
