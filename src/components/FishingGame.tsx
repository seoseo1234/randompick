import React, { useEffect, useState } from 'react';

interface Props {
  students: string[];
  picked: string[];
  isSpinning: boolean;
  onComplete: () => void;
}

export const FishingGame: React.FC<Props> = ({ students, picked, isSpinning, onComplete }) => {
  const [fishes, setFishes] = useState<{id: number, name: string, isCaught: boolean, top: number, left: number, delay: number, rotation: number}[]>([]);
  const [caughtIndex, setCaughtIndex] = useState<number>(-1);
  const [hookPos, setHookPos] = useState<{x: number, y: number}>({x: 52, y: 25});

  useEffect(() => {
    if (!isSpinning) {
      setCaughtIndex(-1);
      setHookPos({x: 52, y: 25});
      const newFishes = picked.map((_, i) => ({
        id: i,
        name: '❓',
        isCaught: false,
        top: 60 + Math.random() * 30, 
        left: 20 + Math.random() * 60, 
        delay: Math.random() * 2,
        rotation: 0
      }));
      setFishes(newFishes);
    }
  }, [isSpinning, picked]);

  useEffect(() => {
    if (isSpinning && picked.length > 0) {
      let step = 0;
      
      const catchNext = () => {
        if (step >= picked.length) {
          setTimeout(onComplete, 1000);
          return;
        }

        const targetFish = fishes[step];
        if (!targetFish) return;

        setHookPos({ x: targetFish.left, y: targetFish.top });
        
        setTimeout(() => {
          setFishes(prev => {
            const next = [...prev];
            if (next[step]) {
              next[step].isCaught = true;
              next[step].name = picked[step];
            }
            return next;
          });
          setCaughtIndex(step);
          
          setTimeout(() => {
            setHookPos({ x: 52, y: 30 }); 
            setFishes(prev => {
              const next = [...prev];
              if (next[step]) {
                next[step].top = 30; 
                next[step].left = 52;
                next[step].rotation = -90; 
              }
              return next;
            });

            setTimeout(() => {
               setFishes(prev => {
                 const next = [...prev];
                 if (next[step]) {
                   next[step].top = -20; 
                 }
                 return next;
               });
               setCaughtIndex(-1);
               step++;
               setTimeout(catchNext, 500);
            }, 1000);
          }, 800);
        }, 800);
      };

      setTimeout(catchNext, 500);
    }
  }, [isSpinning, picked]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'var(--space-xl) 0', width: '100%', maxWidth: '600px' }}>
      <div style={{ 
        width: '100%', 
        height: '400px', 
        background: 'var(--color-block-navy)', 
        borderRadius: 'var(--rounded-lg)', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Sky */}
        <div style={{ width: '100%', height: '30%', background: 'var(--color-canvas)', position: 'absolute', top: 0, left: 0 }} />
        
        {/* Fisherman */}
        <div style={{ 
          position: 'absolute', 
          top: '12%', 
          left: '42%', 
          fontSize: '3.5rem', 
          zIndex: 10, 
          transform: isSpinning && caughtIndex >= 0 ? 'rotate(-15deg)' : 'none', 
          transition: 'transform 0.3s'
        }}>
          🧑‍🌾🎣
        </div>

        {/* Fishing Line */}
        {isSpinning && (
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 11, pointerEvents: 'none' }}>
            <line 
              x1="52%" 
              y1="25%" 
              x2={`${hookPos.x}%`} 
              y2={`${hookPos.y}%`} 
              stroke="var(--color-inverse-ink)" 
              strokeWidth="2" 
              style={{ transition: 'all 0.8s ease-in-out' }}
            />
          </svg>
        )}

        {/* Hook */}
        {isSpinning && (
          <div style={{
            position: 'absolute',
            top: `${hookPos.y}%`,
            left: `${hookPos.x}%`,
            width: '10px',
            height: '10px',
            background: 'var(--color-inverse-ink)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.8s ease-in-out',
            zIndex: 12
          }} />
        )}

        {/* Fishes */}
        {students.length === 0 ? (
          <div className="text-subhead" style={{ position: 'absolute', top: '50%', width: '100%', textAlign: 'center', color: 'var(--color-on-inverse-soft)' }}>
            명단을 추가해주세요
          </div>
        ) : (
          fishes.map(fish => (
            <div key={fish.id} style={{
              position: 'absolute',
              top: `${fish.top}%`,
              left: `${fish.left}%`,
              transform: `translate(-50%, -50%) rotate(${fish.rotation}deg) ${fish.isCaught ? 'scale(1.2)' : ''}`,
              transition: fish.isCaught ? 'all 0.8s ease-in-out' : 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              fontSize: '32px',
              fontWeight: 600,
              color: fish.isCaught ? 'var(--color-primary)' : 'var(--color-inverse-ink)',
              background: fish.isCaught ? 'var(--color-canvas)' : 'transparent',
              padding: fish.isCaught ? '10px 20px' : '0',
              borderRadius: 'var(--rounded-pill)',
              zIndex: fish.isCaught ? 20 : 5,
              animation: !fish.isCaught && !isSpinning ? `swim 4s infinite alternate ease-in-out ${fish.delay}s` : 'none'
            }}>
              {fish.isCaught ? fish.name : '🐟'}
            </div>
          ))
        )}

        <style>
          {`
            @keyframes swim {
              0% { transform: translate(-50%, -50%) translateX(-30px) translateY(-10px) rotate(-10deg); }
              100% { transform: translate(-50%, -50%) translateX(30px) translateY(10px) rotate(10deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};
