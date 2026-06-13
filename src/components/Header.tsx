import React from 'react';

interface Props {
  mode: 'roulette' | 'slot' | 'fishing';
  setMode: (mode: 'roulette' | 'slot' | 'fishing') => void;
  count: number;
  setCount: (count: number) => void;
  onOpenStudentManager: () => void;
  studentCount: number;
}

export const Header: React.FC<Props> = ({ mode, setMode, count, setCount, onOpenStudentManager, studentCount }) => {
  return (
    <header className="glass-panel" style={{ width: '90%', maxWidth: '800px', margin: '20px auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontFamily: 'Jua', color: '#ff6b6b', margin: 0 }}>🎉 두근두근 발표자 뽑기</h1>
        <button className="btn-secondary" onClick={onOpenStudentManager}>
          명단 관리 ({studentCount}명)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '15px' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontFamily: 'Jua', marginBottom: '5px', color: '#2d3436' }}>추출 모드</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button 
              className={`btn-secondary ${mode === 'roulette' ? '' : 'btn-outline'}`} 
              style={mode !== 'roulette' ? { background: '#f1f2f6', color: '#2f3542', boxShadow: 'none' } : {}}
              onClick={() => setMode('roulette')}
            >🎯 룰렛</button>
            <button 
              className={`btn-secondary ${mode === 'slot' ? '' : 'btn-outline'}`}
              style={mode !== 'slot' ? { background: '#f1f2f6', color: '#2f3542', boxShadow: 'none' } : {}}
              onClick={() => setMode('slot')}
            >🎰 슬롯머신</button>
            <button 
              className={`btn-secondary ${mode === 'fishing' ? '' : 'btn-outline'}`}
              style={mode !== 'fishing' ? { background: '#f1f2f6', color: '#2f3542', boxShadow: 'none' } : {}}
              onClick={() => setMode('fishing')}
            >🎣 낚시</button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontFamily: 'Jua', marginBottom: '5px', color: '#2d3436' }}>뽑을 인원수</label>
          <select 
            value={count} 
            onChange={(e) => setCount(Number(e.target.value))}
            style={{ width: '100px', padding: '8px 15px', fontSize: '1.1rem' }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n}명</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
