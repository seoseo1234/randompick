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
    <header className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <h1 className="text-headline" style={{ margin: 0 }}>발표자 뽑기</h1>
        <div style={{ display: 'flex', gap: 'var(--space-xs)', background: 'var(--color-surface-soft)', padding: '4px', borderRadius: 'var(--rounded-pill)' }}>
          <button 
            className={mode === 'roulette' ? 'pricing-tab-selected' : 'pricing-tab-default'} 
            onClick={() => setMode('roulette')}
          >룰렛</button>
          <button 
            className={mode === 'slot' ? 'pricing-tab-selected' : 'pricing-tab-default'}
            onClick={() => setMode('slot')}
          >슬롯머신</button>
          <button 
            className={mode === 'fishing' ? 'pricing-tab-selected' : 'pricing-tab-default'}
            onClick={() => setMode('fishing')}
          >낚시</button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <span className="text-body-sm" style={{ fontWeight: 500 }}>뽑을 인원수</span>
          <select 
            value={count} 
            onChange={(e) => setCount(Number(e.target.value))}
            className="text-input"
            style={{ width: '80px', padding: '8px 12px', border: 'none', background: 'var(--color-surface-soft)' }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n}명</option>
            ))}
          </select>
        </div>
        <button className="button-secondary" onClick={onOpenStudentManager}>
          명단 관리 ({studentCount})
        </button>
      </div>
    </header>
  );
};
