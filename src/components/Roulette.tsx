import React, { useEffect, useRef } from 'react';

interface Props {
  students: string[];
  picked: string[];
  isSpinning: boolean;
  onComplete: () => void;
}

export const Roulette: React.FC<Props> = ({ students, picked, isSpinning, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const currentRotation = useRef<number>(0);
  const targetRotation = useRef<number>(0);
  const isAnimating = useRef<boolean>(false);

  // Figma inspired pastel colors for the wheel
  const colors = [
    'var(--color-block-lilac)', 
    'var(--color-block-cream)', 
    'var(--color-block-mint)', 
    'var(--color-block-pink)', 
    'var(--color-block-coral)', 
    'var(--color-surface-soft)'
  ];

  // Draw the wheel
  const drawWheel = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (students.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = '20px "Paperozi", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('명단을 추가해주세요', centerX, centerY);
      return;
    }

    const sliceAngle = (2 * Math.PI) / students.length;

    for (let i = 0; i < students.length; i++) {
      const startAngle = rotation + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      const computedColor = getComputedStyle(document.documentElement).getPropertyValue(colors[i % colors.length].replace('var(', '').replace(')', '')).trim() || colors[i % colors.length];
      
      // Fallback if computedStyle fails
      ctx.fillStyle = computedColor.startsWith('#') || computedColor.startsWith('rgb') ? computedColor : '#f4ecd6'; 
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#000000';
      ctx.font = '600 20px "Paperozi", sans-serif';
      ctx.fillText(students[i], radius - 20, 5);
      ctx.restore();
    }

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius - 10, centerY);
    ctx.lineTo(centerX + radius + 20, centerY - 15);
    ctx.lineTo(centerX + radius + 20, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#000000';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(currentRotation.current);
  }, [students]);

  useEffect(() => {
    if (isSpinning && !isAnimating.current && students.length > 0) {
      isAnimating.current = true;
      const spins = 5; // number of full rotations
      
      const targetIndex = students.indexOf(picked[0]);
      const sliceAngle = (2 * Math.PI) / students.length;
      
      const targetRadian = (2 * Math.PI * spins) - (targetIndex * sliceAngle) - (sliceAngle / 2);
      targetRotation.current = currentRotation.current + targetRadian + (Math.random() * sliceAngle * 0.6 - sliceAngle * 0.3); 
      
      let startTime: number | null = null;
      const duration = 4000; 

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        const ease = 1 - Math.pow(1 - progress, 4);
        currentRotation.current = currentRotation.current + (targetRotation.current - currentRotation.current) * ease;
        
        drawWheel(currentRotation.current);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          isAnimating.current = false;
          onComplete();
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSpinning]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'var(--space-xl) 0' }}>
      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef} width={400} height={400}></canvas>
        <div style={{ position: 'absolute', top: '50%', right: '-30px', transform: 'translateY(-50%)', fontSize: '30px' }}>
          ◀
        </div>
      </div>
    </div>
  );
};
