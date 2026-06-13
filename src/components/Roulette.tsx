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

  const colors = ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1', '#5f27cd', '#c8d6e5', '#ff9f43'];

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
      ctx.fillStyle = '#f1f2f6';
      ctx.fill();
      ctx.fillStyle = '#a4b0be';
      ctx.font = '24px Jua';
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
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Jua';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText(students[i], radius - 20, 5);
      ctx.restore();
    }

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius - 10, centerY);
    ctx.lineTo(centerX + radius + 20, centerY - 15);
    ctx.lineTo(centerX + radius + 20, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#ff4757';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(currentRotation.current);
  }, [students]);

  useEffect(() => {
    if (isSpinning && !isAnimating.current && students.length > 0) {
      isAnimating.current = true;
      const spins = 5; // number of full rotations
      
      // We assume picking the first one in the picked list for the roulette pointer
      // If multiple are picked, roulette will just point to the first one visually, 
      // and we display all picked ones below.
      const targetIndex = students.indexOf(picked[0]);
      const sliceAngle = (2 * Math.PI) / students.length;
      
      // Calculate rotation to land exactly on the target index slice
      // Pointer is at 0 radians (right side). We want the center of the target slice to be at 0 radians.
      // startAngle + sliceAngle/2 = 0 + 2PI*k -> rotation + index * sliceAngle + sliceAngle/2 = 2PI*k
      const targetRadian = (2 * Math.PI * spins) - (targetIndex * sliceAngle) - (sliceAngle / 2);
      
      targetRotation.current = currentRotation.current + targetRadian + (Math.random() * sliceAngle * 0.6 - sliceAngle * 0.3); // add slight randomness inside the slice
      
      let startTime: number | null = null;
      const duration = 4000; // 4 seconds

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function: easeOutQuart
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef} width={400} height={400} style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}></canvas>
        <div style={{ position: 'absolute', top: '50%', right: '-20px', transform: 'translateY(-50%)', fontSize: '40px' }}>
          ⬅️
        </div>
      </div>
    </div>
  );
};
