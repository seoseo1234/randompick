import React, { useState } from 'react';
import type { AppState } from '../hooks/usePresenterStore';

interface Props {
  onClose: () => void;
  state: AppState;
  setSecretQueue: (queue: string[]) => void;
}

export const SecretSettings: React.FC<Props> = ({ onClose, state, setSecretQueue }) => {
  const [queue, setQueue] = useState<string[]>(state.secretQueue);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  const handleAdd = () => {
    if (selectedStudent && !queue.includes(selectedStudent)) {
      setQueue([...queue, selectedStudent]);
      setSelectedStudent('');
    }
  };

  const handleRemove = (name: string) => {
    setQueue(queue.filter(s => s !== name));
  };

  const handleSave = () => {
    setSecretQueue(queue);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="text-headline" style={{ marginBottom: 'var(--space-md)' }}>선생님 모드</h2>
        <p className="text-body-sm" style={{ marginBottom: 'var(--space-lg)', color: '#666' }}>
          미리 지정한 순서대로 학생이 추출됩니다. 지정된 인원 이후에는 남은 학생 중 랜덤으로 추출됩니다.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
          <select 
            className="text-input"
            value={selectedStudent} 
            onChange={e => setSelectedStudent(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">학생을 선택하세요</option>
            {state.students.filter(s => !queue.includes(s)).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="button-secondary" onClick={handleAdd}>추가</button>
        </div>

        <h3 className="text-card-title" style={{ marginBottom: 'var(--space-sm)' }}>추출 대기열 ({queue.length}명)</h3>
        <div style={{ 
          minHeight: '100px', 
          maxHeight: '200px', 
          overflowY: 'auto', 
          marginBottom: 'var(--space-xl)', 
          background: 'var(--color-surface-soft)', 
          padding: 'var(--space-sm)', 
          borderRadius: 'var(--rounded-md)',
          border: '1px solid var(--color-hairline)'
        }}>
          {queue.length === 0 ? (
            <p className="text-body-sm" style={{ color: '#888', textAlign: 'center', padding: 'var(--space-md) 0' }}>대기열이 비어있습니다.</p>
          ) : (
            queue.map((name, index) => (
              <div key={name} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '8px 12px', 
                background: 'var(--color-canvas)', 
                borderRadius: 'var(--rounded-md)', 
                marginBottom: '8px', 
                border: '1px solid var(--color-hairline)' 
              }}>
                <span className="text-body"><strong>{index + 1}.</strong> {name}</span>
                <button onClick={() => handleRemove(name)} style={{ padding: '0 8px', color: '#ff3d8b', fontSize: '20px' }}>&times;</button>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
          <button className="button-secondary" onClick={() => setQueue([])}>초기화</button>
          <button className="button-primary" onClick={handleSave}>저장 및 닫기</button>
        </div>
      </div>
    </div>
  );
};
