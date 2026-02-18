import useAudio from '../../hooks/useAudio';

export default function MuteButton() {
  const { muted, toggle } = useAudio();

  return (
    <button
      onClick={toggle}
      className="fixed top-3 right-3 z-50 w-9 h-9 flex items-center justify-center plank-border text-lg leading-none transition-transform active:scale-90"
      style={{ backgroundColor: '#3D2317' }}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}
    </button>
  );
}
