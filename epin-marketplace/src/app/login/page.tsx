'use client';

import { useEffect, useRef } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number; y: number; z: number; o: number }[] = [];
    const numStars = 800;
    const centerX = width / 2;
    const centerY = height / 2;
    const focalLength = width * 2;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - centerX,
        y: Math.random() * height - centerY,
        z: Math.random() * width,
        o: Math.random(),
      });
    }

    let animationFrameId: number;

    const moveStars = () => {
      ctx.fillStyle = '#0B0E14';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= 0.5; // Speed

        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - centerX;
          star.y = Math.random() * height - centerY;
        }

        const x = centerX + (star.x / star.z) * focalLength;
        const y = centerY + (star.y / star.z) * focalLength;

        if (x > 0 && x < width && y > 0 && y < height) {
          const size = (1 - star.z / width) * 2.5;
          const opacity = (1 - star.z / width);

          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(moveStars);
    };

    moveStars();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B0E14] text-white font-display">
      {/* 3D Deep Space Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full"
      />

      {/* Overlay Gradient for Depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#0B0E14]/20 to-[#0B0E14]/80 pointer-events-none"></div>

      <div className="relative z-10 flex min-h-screen w-full">
        {/* Left Panel - Pure Visual (No Text) */}
        <div className="hidden w-1/2 lg:block">
          {/* The canvas covers the whole screen, so this just reserves space */}
        </div>

        {/* Right Panel - Auth Form */}
        <div className="flex w-full items-center justify-center px-4 lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[420px]"
          >
            <AuthForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
