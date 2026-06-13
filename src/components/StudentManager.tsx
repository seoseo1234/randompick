import React, { useState } from 'react';
import type { AppState } from '../hooks/usePresenterStore';

interface Props {
  onClose: () => void;
  state: AppState;
  addStudent: (name: string) => void;
  addStudentsBulk: (names: string) => void;
  removeStudent: (name: string) => void;
  clearStudents: () => void;
}

export const StudentManager: React.FC<Props> = ({ onClose, state, addStudent, addStudentsBulk, removeStudent, clearStudents }) => {
  const [singleName, setSingleName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleName.trim()) {
      addStudent(singleName);
      setSingleName('');
    }
  };

  const handleAddBulk = () => {
    if (bulkNames.trim()) {
      addStudentsBulk(bulkNames);
      setBulkNames('');
      setIsBulkMode(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="text-headline" style={{ marginBottom: 'var(--space-lg)' }}>명단 관리</h2>

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)', background: 'var(--color-surface-soft)', padding: '4px', borderRadius: 'var(--rounded-pill)', width: 'fit-content' }}>
            <button 
              className={!isBulkMode ? 'pricing-tab-selected' : 'pricing-tab-default'}
              onClick={() => setIsBulkMode(false)}
            >한 명씩 추가</button>
            <button 
              className={isBulkMode ? 'pricing-tab-selected' : 'pricing-tab-default'}
              onClick={() => setIsBulkMode(true)}
            >일괄 추가</button>
          </div>

          {!isBulkMode ? (
            <form onSubmit={handleAddSingle} style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <input 
                type="text" 
                className="text-input"
                placeholder="학생 이름 입력" 
                value={singleName} 
                onChange={e => setSingleName(e.target.value)} 
              />
              <button type="submit" className="button-primary">추가</button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <textarea 
                className="text-input"
                rows={4} 
                placeholder="이름을 줄바꿈이나 쉼표로 구분해서 입력하세요." 
                value={bulkNames} 
                onChange={e => setBulkNames(e.target.value)}
              />
              <button onClick={handleAddBulk} className="button-primary" style={{ alignSelf: 'flex-end' }}>일괄 추가</button>
            </div>
          )}
        </div>

        <h3 className="text-card-title" style={{ marginBottom: 'var(--space-sm)' }}>현재 명단 ({state.students.length}명)</h3>
        <div style={{ 
          maxHeight: '200px', 
          overflowY: 'auto', 
          marginBottom: 'var(--space-lg)', 
          background: 'var(--color-surface-soft)', 
          padding: 'var(--space-sm)', 
          borderRadius: 'var(--rounded-md)',
          border: '1px solid var(--color-hairline)'
        }}>
          {state.students.length === 0 ? (
            <p className="text-body-sm" style={{ color: '#888', textAlign: 'center', padding: 'var(--space-md) 0' }}>등록된 학생이 없습니다.</p>
          ) : (
            state.students.map(name => (
              <span key={name} className="student-tag">
                {name}
                <button onClick={() => removeStudent(name)}>&times;</button>
              </span>
            ))
          )}
        </div>

        {state.students.length > 0 && (
          <div style={{ textAlign: 'right' }}>
            <button className="button-secondary" style={{ color: '#ff3d8b' }} onClick={() => {
              if (window.confirm('정말 모든 명단을 삭제하시겠습니까?')) clearStudents();
            }}>전체 삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};
