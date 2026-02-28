'use client';

import { useEffect, useRef } from 'react';

interface Shape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  vAngle: number;
  sides: number;
  life: number;
  maxLife: number;
  alpha: number;
}

export default function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = useRef<Shape[]>([]);
  const mouseLastSpawnAt = useRef(0);
  const mouseLastPos = useRef({ x: -100, y: -100 });
  const isMouseDown = useRef(false);

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

    const createShape = (x: number, y: number, ambient = false) => {
      // Limit number of shapes for performance
      if (!ambient && shapes.current.length > 60) return;

      const sides = Math.floor(Math.random() * 4) + 3; // 3 to 6 sides (triangle to hexagon)
      const size = ambient ? Math.random() * 30 + 10 : Math.random() * 20 + 5;
      const speedMult = ambient ? 0.3 : (isMouseDown.current ? 3 : 1.5);

      shapes.current.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * speedMult,
        vy: (Math.random() - 0.5) * speedMult - (ambient ? 0.2 : 0),
        size,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.05,
        sides,
        life: 0,
        maxLife: ambient ? Math.random() * 200 + 300 : Math.random() * 60 + 40,
        alpha: ambient ? 0.05 + Math.random() * 0.1 : 0.4 + Math.random() * 0.4,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dist = Math.hypot(e.clientX - mouseLastPos.current.x, e.clientY - mouseLastPos.current.y);

      // Throttle spawn rate by time and distance
      if (now - mouseLastSpawnAt.current > 30 || dist > 30) {
        createShape(e.clientX, e.clientY);
        mouseLastSpawnAt.current = now;
        mouseLastPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = () => { isMouseDown.current = true; };
    const handleMouseUp = () => { isMouseDown.current = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Initial ambient shapes
    for (let i = 0; i < 30; i++) {
      createShape(Math.random() * canvas.width, Math.random() * canvas.height, true);
    }

    const drawPolygon = (ctx: CanvasRenderingContext2D, s: Shape) => {
      ctx.beginPath();
      for (let i = 0; i < s.sides; i++) {
        const a = s.angle + (i * Math.PI * 2) / s.sides;
        const px = s.x + Math.cos(a) * s.size;
        const py = s.y + Math.sin(a) * s.size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const animate = () => {
      // Create a slight trailing effect by not clearing completely
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Keep ambient population steady
      const ambientCount = shapes.current.filter(s => s.maxLife > 200).length;
      if (ambientCount < 30 && Math.random() < 0.05) {
        createShape(Math.random() * canvas.width, Math.random() * canvas.height, true);
      }

      for (let i = shapes.current.length - 1; i >= 0; i--) {
        const s = shapes.current[i];

        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.angle += s.vAngle;

        // Scale up slightly over time
        s.size += 0.1;

        // Calculate opacity based on life (fade in quickly, fade out slowly)
        const progress = s.life / s.maxLife;
        let currentAlpha = s.alpha;

        if (progress > 0.8) {
          currentAlpha = s.alpha * (1 - (progress - 0.8) * 5); // fade out at the end
        }

        if (currentAlpha <= 0 || s.life >= s.maxLife) {
          shapes.current.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(163, 230, 53, ${Math.max(0, currentAlpha)})`; // lime-400
        ctx.lineWidth = 1;

        // Add a slight glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(163, 230, 53, ${Math.max(0, currentAlpha * 0.8)})`;

        drawPolygon(ctx, s);
        ctx.stroke();

        // Reset shadow for next draw to not multiply
        ctx.shadowBlur = 0;
      }

      // Draw connection lines between nearby shapes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < shapes.current.length; i++) {
        for (let j = i + 1; j < shapes.current.length; j++) {
          const s1 = shapes.current[i];
          const s2 = shapes.current[j];
          // Only connect if at least one is ambient to keep it clean, or if close enough
          const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);

          if (dist < 100) {
            const lineAlpha = (1 - dist / 100) * 0.15;
            ctx.strokeStyle = `rgba(163, 230, 53, ${Math.max(0, lineAlpha)})`;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
