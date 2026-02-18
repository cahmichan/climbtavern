import useSessionStore from '../../stores/useSessionStore';
import SessionEntry from './SessionEntry';

export default function SessionHistory() {
  const sessions = useSessionStore((s) => s.sessions);
  const loading = useSessionStore((s) => s.loading);

  if (loading) {
    return (
      <p className="text-center font-body text-base text-tavern-parchment/40 italic py-6">
        Unrolling the scroll...
      </p>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-body text-xl text-tavern-parchment/30 italic">
          Your battle log sits empty, adventurer.
        </p>
        <p className="font-body text-base text-tavern-parchment/20 italic mt-1">
          Time to climb.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionEntry key={session.id} session={session} />
      ))}
    </div>
  );
}
