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
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        mode={mode} 
        setMode={setMode} 
        count={count} 
        setCount={setCount} 
        onOpenStudentManager={() => setShowStudentManager(true)}
        studentCount={store.state.students.length}
      />

      <main style={{ flex: 1, padding: '0 var(--space-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="color-block-section">
          {mode === 'roulette' && (
            <Roulette students={store.state.students} picked={picked} isSpinning={isSpinning} onComplete={handleComplete} />
          )}
          {mode === 'slot' && (
            <SlotMachine students={store.state.students} picked={picked} isSpinning={isSpinning} onComplete={handleComplete} />
          )}
          {mode === 'fishing' && (
            <FishingGame students={store.state.students} picked={picked} isSpinning={isSpinning} onComplete={handleComplete} />
          )}

          <div style={{ marginTop: 'var(--space-xxl)', display: 'flex', justifyContent: 'center' }}>
            {!isSpinning && !showResult && (
              <button className="button-primary" onClick={handleStart}>
                {count}명 뽑기 시작
              </button>
            )}
          </div>
        </div>

        {showResult && (
          <div className="color-block-section-lilac" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <h2 className="text-display-lg" style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>당첨자 발표</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', justifyContent: 'center' }}>
              {picked.map((name, i) => (
                <div key={i} className="white-card" style={{ 
                  padding: 'var(--space-sm) var(--space-lg)', 
                  borderRadius: 'var(--rounded-pill)',
                  fontWeight: 600,
                  fontSize: '24px'
                }}>
                  {name}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'center' }}>
              <button className="button-primary" onClick={() => setShowResult(false)}>
                다시 하기
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Secret Settings Trigger Icon */}
      <div className="secret-trigger" onClick={handleSecretClick} title="비밀 모드">⚙️</div>

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

