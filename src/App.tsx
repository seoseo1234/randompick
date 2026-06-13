import { useState } from 'react';
import { usePresenterStore } from './hooks/usePresenterStore';
import { Header } from './components/Header';
import { StudentManager } from './components/StudentManager';
import { SecretSettings } from './components/SecretSettings';
import { Roulette } from './components/Roulette';
import { SlotMachine } from './components/SlotMachine';
import { FishingGame } from './components/FishingGame';
import './index.css';

type Mode = 'roulette' | 'slot' | 'fishing';

function App() {
  const store = usePresenterStore();
  const [mode, setMode] = useState<Mode>('roulette');
  const [count, setCount] = useState<number>(1);
  const [showStudentManager, setShowStudentManager] = useState(false);
  const [showSecretSettings, setShowSecretSettings] = useState(false);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Hidden icon click counter logic (if we wanted multi-click), 
  // but PRD requested 1 click on hidden icon.
  const handleSecretClick = () => {
    setShowSecretSettings(true);
  };

  const handleStart = () => {
    if (store.state.students.length === 0) {
      alert("학생 명단을 먼저 추가해주세요!");
      setShowStudentManager(true);
      return;
    }
    if (count > store.state.students.length) {
      alert(`학생 수가 부족합니다. (현재 ${store.state.students.length}명)`);
      return;
    }

    const newPicked = store.pickPresenters(count);
    setPicked(newPicked);
    setIsSpinning(true);
    setShowResult(false);
  };

  const handleComplete = () => {
    setIsSpinning(false);
    setShowResult(true);
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header 
        mode={mode} 
        setMode={setMode} 
        count={count} 
        setCount={setCount} 
        onOpenStudentManager={() => setShowStudentManager(true)}
        studentCount={store.state.students.length}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {mode === 'roulette' && (
          <Roulette students={store.state.students} picked={picked} isSpinning={isSpinning} onComplete={handleComplete} />
        )}
        {mode === 'slot' && (
          <SlotMachine students={store.state.students} picked={picked} isSpinning={isSpinning} onComplete={handleComplete} />
        )}
        {mode === 'fishing' && (
          <FishingGame students={store.state.students} picked={picked} isSpinning={isSpinning} onComplete={handleComplete} />
        )}

        <div style={{ marginTop: '20px', minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!isSpinning && !showResult && (
            <button className="btn-primary" style={{ fontSize: '1.5rem', padding: '15px 40px' }} onClick={handleStart}>
              {count}명 뽑기 시작!
            </button>
          )}

          {showResult && (
            <div className="glass-panel" style={{ padding: '20px 40px', textAlign: 'center', animation: 'slideUp 0.5s ease-out' }}>
              <h2 style={{ fontFamily: 'Jua', color: '#ff4757', marginBottom: '15px', fontSize: '2rem' }}>🎉 당첨자 발표 🎉</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
                {picked.map((name, i) => (
                  <div key={i} style={{ 
                    background: '#feca57', 
                    padding: '10px 25px', 
                    borderRadius: '20px', 
                    fontFamily: 'Jua', 
                    fontSize: '1.5rem',
                    color: '#2d3436',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    {name}
                  </div>
                ))}
              </div>
              <button className="btn-secondary" style={{ marginTop: '20px' }} onClick={() => setShowResult(false)}>
                다시 하기
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Secret Settings Trigger Icon */}
      <div className="secret-trigger" onClick={handleSecretClick} title="비밀 모드" />

      {/* Modals */}
      {showStudentManager && (
        <StudentManager 
          onClose={() => setShowStudentManager(false)} 
          state={store.state}
          addStudent={store.addStudent}
          addStudentsBulk={store.addStudentsBulk}
          removeStudent={store.removeStudent}
          clearStudents={store.clearStudents}
        />
      )}

      {showSecretSettings && (
        <SecretSettings 
          onClose={() => setShowSecretSettings(false)}
          state={store.state}
          setSecretQueue={store.setSecretQueue}
        />
      )}
    </div>
  );
}

export default App;
