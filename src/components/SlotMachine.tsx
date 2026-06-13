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
       setDisplayedNames(Array(1).fill('준비'));
    }
  }, [students, isSpinning, picked]);

  useEffect(() => {
    if (isSpinning) {
      setDisplayedNames(Array(picked.length).fill('🎰'));
      setSpinningIndexes(picked.map((_, i) => i));

      picked.forEach((name, idx) => {
        setTimeout(() => {
          setDisplayedNames(prev => {
            const next = [...prev];
            next[idx] = name;
            return next;
          });
          setSpinningIndexes(prev => prev.filter(i => i !== idx));

          if (idx === picked.length - 1) {
            setTimeout(onComplete, 500); 
          }
        }, 1000 + idx * 800); 
      });
    }
  }, [isSpinning]);

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
      }, 100); 
    }
    return () => clearInterval(interval);
  }, [spinningIndexes, students]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'var(--space-xxl) 0' }}>
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-md)', 
        padding: 'var(--space-xxl)', 
        background: 'var(--color-canvas)', 
        border: '1px solid var(--color-hairline)', 
        borderRadius: 'var(--rounded-lg)', 
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)' 
      }}>
        {students.length === 0 ? (
          <div className="text-headline">명단을 추가해주세요</div>
        ) : (
          displayedNames.map((name, idx) => (
            <div key={idx} style={{ 
              width: '120px', 
              height: '150px', 
              background: 'var(--color-surface-soft)', 
              borderRadius: 'var(--rounded-md)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--color-ink)',
              border: '1px solid var(--color-hairline)',
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
