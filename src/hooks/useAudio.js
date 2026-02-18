import { create } from 'zustand';

/**
 * Web Audio API synthesized sounds — no external files needed.
 * Muted by default. User must explicitly unmute.
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Play a coin / pickup sound */
function playCoin() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'square';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(988, now);         // B5
  osc.frequency.setValueAtTime(1319, now + 0.08); // E6
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  osc.start(now);
  osc.stop(now + 0.25);
}

/** Play a parchment / paper rustle sound */
function playParchment() {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 0.5;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
}

/** Play a fanfare / level-up sound */
function playFanfare() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    const t = now + i * 0.12;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, now);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.35);
  });
}

/** Ambient background drone (looping via scheduling) */
let ambienceInterval = null;

function startAmbience() {
  if (ambienceInterval) return;

  function playDrone() {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Low rumble
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(80 + Math.random() * 20, now);
    gain1.gain.setValueAtTime(0.03, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 3);
    osc1.start(now);
    osc1.stop(now + 3);

    // Crackle
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.04, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    source.connect(filter);
    filter.connect(gain2);
    gain2.connect(ctx.destination);
    source.start(now);
  }

  playDrone();
  ambienceInterval = setInterval(playDrone, 3000 + Math.random() * 2000);
}

function stopAmbience() {
  if (ambienceInterval) {
    clearInterval(ambienceInterval);
    ambienceInterval = null;
  }
}

const SOUNDS = {
  coin: playCoin,
  parchment: playParchment,
  fanfare: playFanfare,
  ambience: startAmbience,
};

const useAudioStore = create((set, get) => ({
  muted: true,

  toggle: () => {
    const { muted } = get();
    const next = !muted;
    set({ muted: next });

    if (next) {
      stopAmbience();
    } else {
      // Resume AudioContext on user gesture
      getCtx();
      startAmbience();
    }
  },

  play: (name) => {
    const { muted } = get();
    if (muted) return;
    const fn = SOUNDS[name];
    if (fn) fn();
  },
}));

export default function useAudio() {
  const muted = useAudioStore((s) => s.muted);
  const toggle = useAudioStore((s) => s.toggle);
  const play = useAudioStore((s) => s.play);
  return { muted, toggle, play };
}

export { useAudioStore };
