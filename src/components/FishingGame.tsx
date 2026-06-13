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
  const [lineHeight, setLineHeight] = useState<number>(0);
  const [hookPos, setHookPos] = useState<{x: number, y: number}>({x: 52, y: 25});

  useEffect(() => {
    if (!isSpinning) {
      setCaughtIndex(-1);
      setLineHeight(0);
      setHookPos({x: 52, y: 25});
      const newFishes = picked.map((_, i) => ({
        id: i,
        name: '❓',
        isCaught: false,
        top: 60 + Math.random() * 30, // 60 to 90
        left: 20 + Math.random() * 60, // 20 to 80
        delay: Math.random() * 2,
        rotation: 0
      }));
      setFishes(newFishes);
    }
  }, [isSpinning, picked]);

  useEffect(() => {
    if (isSpinning && picked.length > 0) {
      // Catch loop
      let step = 0;
      
      const catchNext = () => {
        if (step >= picked.length) {
          setTimeout(onComplete, 1000);
          return;
        }

        const targetFish = fishes[step];
        if (!targetFish) return;

        // 1. Move hook down to the fish
        setLineHeight(targetFish.top - 25);
        setHookPos({ x: targetFish.left, y: targetFish.top });
        
        // 2. Fish gets hooked (wait for line to reach)
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
          
          // 3. Pull up together
          setTimeout(() => {
            setLineHeight(5); // bring line up
            setHookPos({ x: 52, y: 30 }); // hook position up
            setFishes(prev => {
              const next = [...prev];
              if (next[step]) {
                next[step].top = 30; // fish follows hook
                next[step].left = 52;
                next[step].rotation = -90; // hang vertically
              }
              return next;
            });

            // 4. Next fish after pulling up
            setTimeout(() => {
               // throw fish into bucket (hide it)
               setFishes(prev => {
                 const next = [...prev];
                 if (next[step]) {
                   next[step].top = -20; // out of screen
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
  }, [isSpinning, picked]); // removed fishes dependency to prevent infinite loops

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0', width: '100%', maxWidth: '600px' }}>
      <div style={{ 
        width: '100%', 
        height: '400px', 
        background: 'linear-gradient(to bottom, #1e3c72 0%, #2a5298 30%, #0a192f 100%)', 
        borderRadius: '30px', 
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Sky */}
        <div style={{ width: '100%', height: '30%', background: 'linear-gradient(to bottom, #0f2027, #203a43)', position: 'absolute', top: 0, left: 0 }} />
        
        {/* Fisherman */}
        <div style={{ 
          position: 'absolute', 
          top: '12%', 
          left: '42%', 
          fontSize: '3.5rem', 
          zIndex: 10, 
          transform: isSpinning && caughtIndex >= 0 ? 'rotate(-15deg)' : 'none', 
          transition: 'transform 0.3s',
          filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))'
        }}>
          🧑‍🌾🎣
        </div>

        {/* Fishing Line (Dynamic SVG line from rod to hook) */}
        {isSpinning && (
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 11, pointerEvents: 'none' }}>
            <line 
              x1="52%" 
              y1="25%" 
              x2={`${hookPos.x}%`} 
              y2={`${hookPos.y}%`} 
              stroke="rgba(255,255,255,0.6)" 
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
            background: 'silver',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.8s ease-in-out',
            zIndex: 12
          }} />
        )}

        {/* Fishes */}
        {students.length === 0 ? (
          <div style={{ position: 'absolute', top: '50%', width: '100%', textAlign: 'center', fontFamily: 'Jua', color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem' }}>
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
              fontSize: '2.5rem',
              fontFamily: 'Jua',
              color: fish.isCaught ? '#ff4757' : 'white',
              background: fish.isCaught ? 'rgba(255,255,255,0.9)' : 'transparent',
              padding: fish.isCaught ? '10px 20px' : '0',
              borderRadius: '20px',
              boxShadow: fish.isCaught ? '0 10px 25px rgba(0,0,0,0.5)' : 'none',
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
