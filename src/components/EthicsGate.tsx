import { useState } from 'react';

interface EthicsGateProps {
  onAgree: () => void;
}

export function EthicsGate({ onAgree }: EthicsGateProps) {
  const [isChecked, setIsChecked] = useState(false);

  const guides = [
    {
      id: 1,
      title: '가이드 1. 활용 목적',
      tags: [{ label: '주도성', color: '#f39c12' }, { label: '합목적성', color: '#27ae60' }],
      heading: "생성형 AI를 쓰기 전, '왜' 쓰는지 말할 수 있어야 해요.",
      desc: "생성형 AI를 사용하기 전에 '지금 내가 왜 쓰려고 하지?'라고 스스로 물어보세요. 생성형 AI는 내 생각을 대신해주는 게 아니라, 내 생각을 도와주는 도구임을 기억하세요. 모든 공부에 생성형 AI가 필요한 것은 아니므로, 지금 하는 활동에 생성형 AI를 사용하는 것이 나의 학습에 정말 도움이 될지 먼저 고민해요."
    },
    {
      id: 2,
      title: '가이드 2. 주도적 학습',
      tags: [{ label: '주도성', color: '#f39c12' }],
      heading: "생성형 AI에게 물어보기 전, 내 생각을 먼저 말해요.",
      desc: "막막할 때 바로 생성형 AI에게 묻고 싶은 마음이 들 수 있지만, 먼저 스스로 시도해 보아야 나의 성장에 도움이 돼요. 주제에 대해 내가 아는 것과 내 아이디어를 먼저 공책에 적거나 정리한 뒤에 생성형 AI를 활용하세요."
    },
    {
      id: 3,
      title: '가이드 3. 비판적 검증',
      tags: [{ label: '주도성', color: '#f39c12' }],
      heading: "생성형 AI가 틀릴 수 있다는 점을 알아요.",
      desc: "생성형 AI는 틀린 정보를 마치 사실인 것처럼 제시하기도 하므로, 알려준 내용은 항상 '정말 맞을까?' 하고 한 번 더 확인하는 습관을 가져요. 중요한 내용일수록 책을 찾아보거나 선생님께 여쭤보는 등 다른 방법으로도 꼭 다시 확인하세요."
    },
    {
      id: 4,
      title: '가이드 4. 사고의 확장',
      tags: [{ label: '주도성', color: '#f39c12' }, { label: '합목적성', color: '#27ae60' }],
      heading: "생성형 AI와 함께 상상하며 내 생각을 더 크게 키워요.",
      desc: "생성형 AI를 내 생각의 범위를 넓혀주는 도구로 사용해보세요. 생성형 AI의 결과물을 그대로 사용하지 않고, 나의 경험과 생각을 더하여 나만의 색깔을 담은 최종 결과물을 만들어요."
    },
    {
      id: 5,
      title: '가이드 5. 안전과 관계',
      tags: [{ label: '안전성', color: '#2980b9' }],
      heading: "나의 정보와 비밀을 말하지 않아요.",
      desc: "내가 입력한 정보는 어디에서 어떻게 사용될지 모르기 때문에 이름, 주소, 학교, 전화번호 같은 개인정보는 생성형 AI에게 알려주면 안돼요. 생성형 AI는 계산된 답변을 내놓는 프로그램이라 감정이 없어요. 나의 고민을 털어놓으며 지나치게 의지하기보다, 친구나 부모님, 선생님과의 실제 대화를 통해 마음을 나누어요."
    },
    {
      id: 6,
      title: '가이드 6. 투명성·윤리',
      tags: [{ label: '투명성', color: '#f1c40f' }],
      heading: "생성형 AI의 도움을 받았다면 숨기지 않고 정직하게 이야기해요.",
      desc: "어느 부분이 생성형 AI의 것이고 어느 부분이 나의 것인지 명확히 밝히는 것은 나 자신을 속이지 않는 정직한 태도예요. 생성형 AI를 쓴 사실을 정직하게 밝힐 때 나의 노력이 더 빛나고 가치 있게 인정받을 수 있어요."
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--color-canvas)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.3s ease-out',
      overflow: 'hidden'
    }}>
      {/* Header Area */}
      <div style={{
        padding: 'var(--space-xl) var(--space-xl) var(--space-md)',
        borderBottom: '1px solid var(--color-hairline)',
        backgroundColor: 'var(--color-block-cream)',
        textAlign: 'center'
      }}>
        <h1 className="text-display-lg" style={{ marginBottom: 'var(--space-xs)' }}>윤리 핵심가이드</h1>
        <p className="text-body-lg" style={{ color: '#666' }}>본 활동을 시작하기 전, 아래의 가이드를 꼭 읽고 실천을 약속해 주세요.</p>
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-xl)',
        backgroundColor: 'var(--color-surface-soft)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)'
        }}>
          {guides.map(guide => (
            <div key={guide.id} className="white-card" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                <span className="text-eyebrow" style={{ color: '#555', marginRight: 'var(--space-xs)' }}>{guide.title}</span>
                {guide.tags.map((tag, idx) => (
                  <span key={idx} style={{
                    backgroundColor: tag.color,
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: 'var(--rounded-pill)',
                    fontSize: '13px',
                    fontWeight: 600
                  }}>
                    {tag.label}
                  </span>
                ))}
              </div>
              <h3 className="text-card-title">{guide.heading}</h3>
              <p className="text-body" style={{ color: '#444' }}>{guide.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Action Area */}
      <div style={{
        padding: 'var(--space-xl)',
        borderTop: '1px solid var(--color-hairline)',
        backgroundColor: 'var(--color-canvas)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-md)'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: 500,
          userSelect: 'none'
        }}>
          <input 
            type="checkbox" 
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
          />
          나는 윤리 핵심가이드를 빠짐없이 읽고 이를 실천하겠습니다.
        </label>
        
        <button 
          className="button-primary"
          onClick={onAgree}
          disabled={!isChecked}
          style={{
            opacity: isChecked ? 1 : 0.5,
            cursor: isChecked ? 'pointer' : 'not-allowed',
            transform: isChecked ? 'none' : 'scale(1)',
            padding: '16px 48px',
            fontSize: '22px',
            boxShadow: isChecked ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          확인하고 시작하기
        </button>
      </div>
    </div>
  );
}
