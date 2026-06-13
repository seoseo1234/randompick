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
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 style={{ fontFamily: 'Jua', marginBottom: '20px', color: '#a4b0be' }}>🔒 선생님 모드</h2>
        <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#ced6e0' }}>
          미리 지정한 순서대로 학생이 추출됩니다. 지정된 인원 이후에는 남은 학생 중 랜덤으로 추출됩니다.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select 
            value={selectedStudent} 
            onChange={e => setSelectedStudent(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">학생을 선택하세요</option>
            {state.students.filter(s => !queue.includes(s)).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="btn-secondary" onClick={handleAdd}>추가</button>
        </div>

        <h3 style={{ fontFamily: 'Jua', marginBottom: '10px' }}>추출 대기열 ({queue.length}명)</h3>
        <div style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '12px' }}>
          {queue.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>대기열이 비어있습니다.</p>
          ) : (
            queue.map((name, index) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                <span><strong>{index + 1}.</strong> {name}</span>
                <button onClick={() => handleRemove(name)} style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn-danger" onClick={() => setQueue([])}>초기화</button>
          <button className="btn-primary" onClick={handleSave}>저장 및 닫기</button>
        </div>
      </div>
    </div>
  );
};
