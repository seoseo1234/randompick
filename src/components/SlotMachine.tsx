import React, { useEffect, useState } from 'react';

interface Props {
  students: string[];
  picked: string[];
  isSpinning: boolean;
  onComplete: () => void;
}

export const SlotMachine: React.FC<Props> = ({ students, picked, isSpinning, onComplete }) => {
  const [displayedNames, setDisplayedNames] = useState<string[]>([]);
  const [spinningIndexes, setSpinningIndexes] = useState<number[]>([]);

  useEffect(() => {
    if (students.length === 0) return;
    if (!isSpinning && picked.length === 0) {
       // Reset state
       setDisplayedNames(Array(1).fill('준비'));
    }
  }, [students, isSpinning, picked]);

  useEffect(() => {
    if (isSpinning) {
      // Start spinning
      setDisplayedNames(Array(picked.length).fill('🎰'));
      setSpinningIndexes(picked.map((_, i) => i));

      // Stop them one by one
      picked.forEach((name, idx) => {
        setTimeout(() => {
          setDisplayedNames(prev => {
            const next = [...prev];
            next[idx] = name;
            return next;
          });
          setSpinningIndexes(prev => prev.filter(i => i !== idx));

          if (idx === picked.length - 1) {
            setTimeout(onComplete, 500); // Wait a bit after last reel stops
          }
        }, 1000 + idx * 800); // 1s for first, 1.8s for second, etc.
      });
    }
  }, [isSpinning]);

  // Simple slot reel effect using CSS animation (fast interval for unstopped reels)
  useEffect(() => {
    let interval: number;
    if (spinningIndexes.length > 0 && students.length > 0) {
      interval = window.setInterval(() => {
        setDisplayedNames(prev => {
          const next = [...prev];
          spinningIndexes.forEach(idx => {
            next[idx] = students[Math.floor(Math.random() * students.length)];
          });
          return next;
        });
      }, 100); // Change name every 100ms for blur effect
    }
    return () => clearInterval(interval);
  }, [spinningIndexes, students]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '40px 0' }}>
      <div className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '30px', background: 'linear-gradient(to bottom, #ff9ff3, #feca57)', border: '5px solid #ff6b6b', borderRadius: '30px', boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.2), 0 15px 30px rgba(0,0,0,0.3)' }}>
        {students.length === 0 ? (
          <div style={{ fontSize: '2rem', fontFamily: 'Jua', color: 'white' }}>명단을 추가해주세요</div>
        ) : (
          displayedNames.map((name, idx) => (
            <div key={idx} style={{ 
              width: '120px', 
              height: '150px', 
              background: 'white', 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontFamily: 'Jua',
              color: '#2d3436',
              boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: spinningIndexes.includes(idx) ? 'translateY(10px)' : 'translateY(0)',
                transition: 'transform 0.1s ease-in-out'
              }}>
                {name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
