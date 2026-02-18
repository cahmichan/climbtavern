import { useRef, useEffect } from 'react';

const PARTICLE_COUNT = 40;

function createParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: 1 + Math.random() * 2,
    speedY: -(0.15 + Math.random() * 0.3),
    speedX: (Math.random() - 0.5) * 0.2,
    opacity: 0.08 + Math.random() * 0.22,
    isAmber: Math.random() > 0.5,
  };
}

export default function TavernBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reinit particles if needed
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
          createParticle(canvas.width, canvas.height)
        );
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isAmber
          ? `rgba(212, 160, 85, ${p.opacity})`
          : `rgba(245, 230, 200, ${p.opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Candlelight radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 50% 40% at 50% 15%,
              rgba(212, 160, 85, 0.12) 0%,
              rgba(212, 160, 85, 0.05) 35%,
              transparent 65%
            ),
            radial-gradient(
              ellipse 100% 100% at 50% 100%,
              rgba(10, 4, 2, 0.7) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse 80% 60% at 50% 50%,
              transparent 40%,
              rgba(10, 4, 2, 0.4) 100%
            )
          `,
        }}
      />
      {/* Dust particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
