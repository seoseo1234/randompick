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
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 style={{ fontFamily: 'Jua', marginBottom: '20px', color: '#ff6b6b' }}>📝 학생 명단 관리</h2>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button 
              className={`btn-secondary ${!isBulkMode ? '' : 'btn-outline'}`}
              style={isBulkMode ? { background: '#f1f2f6', color: '#2f3542' } : {}}
              onClick={() => setIsBulkMode(false)}
            >한 명씩 추가</button>
            <button 
              className={`btn-secondary ${isBulkMode ? '' : 'btn-outline'}`}
              style={!isBulkMode ? { background: '#f1f2f6', color: '#2f3542' } : {}}
              onClick={() => setIsBulkMode(true)}
            >일괄 추가</button>
          </div>

          {!isBulkMode ? (
            <form onSubmit={handleAddSingle} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="학생 이름 입력" 
                value={singleName} 
                onChange={e => setSingleName(e.target.value)} 
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>추가</button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea 
                rows={4} 
                placeholder="이름을 줄바꿈이나 쉼표로 구분해서 입력하세요." 
                value={bulkNames} 
                onChange={e => setBulkNames(e.target.value)}
              />
              <button onClick={handleAddBulk} className="btn-primary" style={{ padding: '10px 20px', alignSelf: 'flex-end' }}>일괄 추가</button>
            </div>
          )}
        </div>

        <h3 style={{ fontFamily: 'Jua', marginBottom: '10px' }}>현재 명단 ({state.students.length}명)</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '12px' }}>
          {state.students.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>등록된 학생이 없습니다.</p>
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
            <button className="btn-danger" onClick={() => {
              if (window.confirm('정말 모든 명단을 삭제하시겠습니까?')) clearStudents();
            }}>전체 삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};
