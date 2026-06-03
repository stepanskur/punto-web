'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Loader = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const circles = [
    { id: 1, angle: 0 },
    { id: 2, angle: 72 },
    { id: 3, angle: 144 },
    { id: 4, angle: 216 },
    { id: 5, angle: 288 },
  ];

  // Увеличили радиус разлета (было 45, стало 90)
  const radius = 90; 

  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-[60vh]' : 'h-full min-h-[300px]'} w-full`}>
      
      {/* Увеличили контейнер до w-72 h-72, чтобы кружки не обрезались при разлете */}
      <div 
        className="relative w-72 h-72 flex items-center justify-center"
        style={{ filter: 'url(#liquid-goo)' }}
      >
        {circles.map((circle, i) => {
          const radian = (circle.angle * Math.PI) / 180;
          const targetX = Math.cos(radian) * radius;
          const targetY = Math.sin(radian) * radius;

          return (
            <motion.div
              key={circle.id}
              className="absolute w-12 h-12 rounded-full bg-brand-red"
              animate={{
                // Координаты теперь пересчитываются с учетом нового радиуса
                x: [0, targetX, targetX * 1.1, -targetX * 0.1, 0],
                y: [0, targetY, targetY * 1.1, -targetY * 0.1, 0],
                scale: [1, 1.2, 1.1, 0.8, 1],
              }}
              transition={{
                duration: 3.2, // Чуть-чуть замедлил, чтобы расстояние преодолевалось еще плавнее
                repeat: Infinity,
                ease: [0.6, 0.01, 0.3, 1], 
                delay: i * 0.15, // Немного увеличил задержку для большей выразительности «волны»
              }}
            />
          );
        })}
      </div>

      <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 19 -9" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};