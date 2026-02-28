'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -100, y: -100, isMoving: false, lastMoveAt: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.isMoving = true;
      mouse.current.lastMoveAt = Date.now();

      // Spawn a new particle when mouse moves
      createParticle(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);

    const createParticle = (x: number, y: number) => {
      // Limit number of particles to keep it performant
      if (particles.current.length > 50) return;

      const size = Math.random() * 20 + 10;
      particles.current.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        size,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() * -1) - 0.5, // Drift slightly upwards
        alpha: 0.3,
        life: 0,
        maxLife: Math.random() * 60 + 40,
      });
    };

    const drawSmoke = (p: Particle) => {
      // A soft, gray/smoke-like gradient
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, `rgba(200, 200, 200, ${p.alpha})`);
      gradient.addColorStop(1, 'rgba(200, 200, 200, 0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check if mouse stopped moving to stop spawning
      if (Date.now() - mouse.current.lastMoveAt > 100) {
        mouse.current.isMoving = false;
      }

      particles.current.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Smoke expands as it ages
        p.size += 0.2;

        // Fade out
        p.alpha = Math.max(0, 0.3 * (1 - p.life / p.maxLife));

        drawSmoke(p);

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.current.splice(i, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
