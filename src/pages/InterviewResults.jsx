import React from 'react';
import { useRouter } from 'next/router';
import { 
  Home, 
  Clock, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  User, 
  Settings,
  Star,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const InterviewResults = ({ onLogout }) => {
  const router = useRouter();

  const handleNavigation = (itemId) => {
    switch(itemId) {
      case 'dashboard':
        router.push('/user-dashboard');
        break;
      case 'live-interview':
        router.push('/live-ai-interview');
        break;
      case 'past-interviews':
        router.push('/weakness-overview');
        break;
      case 'question-bank':
        router.push('/question-bank');
        break;
      case 'subscriptions':
        router.push('/my-plan');
        break;
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'past-interviews', icon: Clock, label: 'Past Interviews' },
    { id: 'live-interview', icon: Zap, label: 'Live AI Interview' },
    { id: 'question-bank', icon: HelpCircle, label: 'Question Bank' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  // Confetti particles
  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 3,
    shape: Math.random() > 0.5 ? 'triangle' : 'circle'
  }));

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Sidebar - nindot nga sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#1f2937',
        backgroundImage: 'url("https://images.pexels.com/photos/12902862/pexels-photo-12902862.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 10
      }}>
        {/* Dark overlay for sidebar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          zIndex: 1
        }}></div>
        
        {/* Sidebar content wrapper */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          {/* Logo Section - logo sa InterviewPro */}
          <div style={{
            padding: '2rem 1.5rem',
            borderBottom: '1px solid rgba(55, 65, 81, 0.5)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <ChatBubbleLogo size={48} />
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                margin: 0,
                color: 'white'
              }}>
                InterviewPro
              </h2>
            </div>
          </div>

          {/* Navigation - mga navigation items */}
          <nav style={{ flex: 1, padding: '1rem 0' }}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'live-interview'; // Live AI Interview is active
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isActive ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                    color: 'white',
                    border: 'none',
                    borderLeft: isActive ? '4px solid #06b6d4' : '4px solid transparent',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.7)';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content - results interface */}
      <div style={{
        marginLeft: '280px',
        width: 'calc(100vw - 280px)',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Confetti Animation */}
        {confettiParticles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              top: '-10px',
              width: particle.shape === 'triangle' ? '0' : '8px',
              height: particle.shape === 'triangle' ? '0' : '8px',
              backgroundColor: particle.shape === 'circle' ? '#fbbf24' : 'transparent',
              borderRadius: particle.shape === 'circle' ? '50%' : '0',
              borderLeft: particle.shape === 'triangle' ? '4px solid transparent' : 'none',
              borderRight: particle.shape === 'triangle' ? '4px solid transparent' : 'none',
              borderBottom: particle.shape === 'triangle' ? '8px solid #fbbf24' : 'none',
              animation: `fall 3s linear infinite`,
              animationDelay: `${particle.animationDelay}s`,
              zIndex: 1
            }}
          />
        ))}

        {/* Results Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Score Display */}
          <div style={{
            fontSize: '8rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            4
          </div>

          {/* Divider Line */}
          <div style={{
            width: '100px',
            height: '4px',
            backgroundColor: 'white',
            marginBottom: '2rem',
            borderRadius: '2px'
          }}></div>

          {/* Star Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                fill={star <= 4 ? '#fbbf24' : 'transparent'}
                color={star <= 4 ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)'}
              />
            ))}
          </div>

          {/* Rating Text */}
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '400',
            margin: 0,
            marginBottom: '4rem'
          }}>
            Good
          </h2>
        </div>

        {/* Feedback Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '24px 24px 0 0',
          color: '#374151',
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* User Response Feedback */}
            <div style={{
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#06b6d4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MessageSquare size={18} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0,
                  color: '#374151'
                }}>
                  User Response Feedback
                </h3>
              </div>
              
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#4b5563'
              }}>
                Good job! You clearly explained the challenge you faced and how you handled it. However, try to focus more on the impact of your solution—how did it benefit your team or company?
              </div>
            </div>

            {/* Improvement Tip */}
            <div style={{
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#fbbf24',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Lightbulb size={18} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0,
                  color: '#374151'
                }}>
                  Improvement Tip
                </h3>
              </div>
              
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#4b5563'
              }}>
                When describing a challenge, highlight the outcome. What changed after you solved the problem? Use numbers or specific results if possible.
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => router.push('/user-dashboard')}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                backgroundColor: '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewResults;