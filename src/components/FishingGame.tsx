import React, { useEffect, useState } from 'react';

interface Props {
  students: string[];
  picked: string[];
  isSpinning: boolean;
  onComplete: () => void;
}

export const FishingGame: React.FC<Props> = ({ students, picked, isSpinning, onComplete }) => {
  const [fishes, setFishes] = useState<{id: number, name: string, isCaught: boolean, top: number, left: number, delay: number}[]>([]);
  const [caughtIndex, setCaughtIndex] = useState<number>(-1);

  useEffect(() => {
    if (!isSpinning) {
      // Spawn fishes moving around
      setCaughtIndex(-1);
      const newFishes = picked.map((_, i) => ({
        id: i,
        name: '❓',
        isCaught: false,
        top: 50 + Math.random() * 40,
        left: 20 + Math.random() * 60,
        delay: Math.random() * 2
      }));
      setFishes(newFishes);
    }
  }, [isSpinning, picked]);

  useEffect(() => {
    if (isSpinning) {
      // Catch them one by one
      picked.forEach((name, idx) => {
        setTimeout(() => {
          setFishes(prev => {
            const next = [...prev];
            if (next[idx]) {
              next[idx].isCaught = true;
              next[idx].name = name;
              next[idx].top = 20; // pull up
              next[idx].left = 50; // center
            }
            return next;
          });
          setCaughtIndex(idx);

          if (idx === picked.length - 1) {
            setTimeout(onComplete, 1500);
          }
        }, 1500 + idx * 2000);
      });
    }
  }, [isSpinning]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0', width: '100%', maxWidth: '600px' }}>
      <div style={{ 
        width: '100%', 
        height: '400px', 
        background: 'linear-gradient(to bottom, #87CEEB 0%, #1E90FF 50%, #00008B 100%)', 
        borderRadius: '30px', 
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '8px solid #8B4513'
      }}>
        {/* Sky/Water line */}
        <div style={{ width: '100%', height: '30%', background: '#E0F6FF', position: 'absolute', top: 0, left: 0 }} />
        
        {/* Boat/Fisherman */}
        <div style={{ position: 'absolute', top: '15%', left: '45%', fontSize: '3rem', zIndex: 10, transform: isSpinning ? 'rotate(-10deg)' : 'none', transition: 'transform 0.5s' }}>
          🧑‍🌾🎣
        </div>

        {/* Fishing Line */}
        {isSpinning && (
          <div style={{ 
            position: 'absolute', 
            top: '25%', 
            left: '52%', 
            width: '2px', 
            height: caughtIndex >= 0 ? '20%' : '50%', 
            background: 'white', 
            transition: 'height 0.5s' 
          }} />
        )}

        {/* Fishes */}
        {students.length === 0 ? (
          <div style={{ position: 'absolute', top: '50%', width: '100%', textAlign: 'center', fontFamily: 'Jua', color: 'white', fontSize: '1.5rem' }}>
            명단을 추가해주세요
          </div>
        ) : (
          fishes.map(fish => (
            <div key={fish.id} style={{
              position: 'absolute',
              top: `${fish.top}%`,
              left: `${fish.left}%`,
              transform: `translate(-50%, -50%) ${fish.isCaught ? 'scale(1.5)' : ''}`,
              transition: 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              fontSize: '2.5rem',
              fontFamily: 'Jua',
              color: fish.isCaught ? '#ff6b6b' : 'white',
              background: fish.isCaught ? 'white' : 'transparent',
              padding: fish.isCaught ? '10px 20px' : '0',
              borderRadius: '20px',
              boxShadow: fish.isCaught ? '0 5px 15px rgba(0,0,0,0.3)' : 'none',
              zIndex: fish.isCaught ? 20 : 5,
              animation: !fish.isCaught ? `swim 3s infinite alternate ease-in-out ${fish.delay}s` : 'none'
            }}>
              {fish.isCaught ? fish.name : '🐟'}
            </div>
          ))
        )}

        <style>
          {`
            @keyframes swim {
              0% { transform: translate(-50%, -50%) translateX(-20px); }
              100% { transform: translate(-50%, -50%) translateX(20px); }
            }
          `}
        </style>
      </div>
    </div>
  );
};
