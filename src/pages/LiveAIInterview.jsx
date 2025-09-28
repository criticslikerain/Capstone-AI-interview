import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  User, 
  Settings,
  FileText,
  Mic,
  CheckCircle
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const LiveAIInterview = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedFocus, setSelectedFocus] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [selectedResponse, setSelectedResponse] = useState('');

  const handleNavigation = (itemId) => {
    switch(itemId) {
      case 'dashboard':
        navigate('/user-dashboard');
        break;
      case 'live-interview':
        navigate('/live-ai-interview');
        break;
      case 'past-interviews':
        navigate('/weakness-overview');
        break;
      case 'question-bank':
        navigate('/question-bank');
        break;
      case 'subscriptions':
        navigate('/my-plan');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
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

  const focusAreas = [
    { 
      id: 'full', 
      label: 'Full Interview', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      )
    },
    { 
      id: 'behavioral', 
      label: 'Behavioral', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.5 2.5 0 0 0 8 7H5.46c-.8 0-1.49.59-1.42 1.37L6.5 16H9v6h2v-6h2v6h4z"/>
        </svg>
      )
    },
    { 
      id: 'technical', 
      label: 'Technical', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
      )
    },
    { 
      id: 'situational', 
      label: 'Situational', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    }
  ];

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

      {/* Main Content - main content area */}
      <div style={{
        marginLeft: '280px',
        width: 'calc(100vw - 280px)',
        height: '100vh',
        overflow: 'auto'
      }}>
        <div style={{
          flex: 1,
          backgroundColor: '#f9fafb',
          minHeight: '100vh'
        }}>
          {/* Header Section - curved header design */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
            position: 'relative',
            paddingTop: '3rem',
            paddingBottom: '8rem',
            color: 'white',
            textAlign: 'center',
            clipPath: 'ellipse(100% 100% at 50% 0%)'
          }}>
            {/* Header content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0 2rem'
            }}>
              {/* Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <img 
                  src="https://static.vecteezy.com/system/resources/previews/024/090/509/non_2x/folder-file-documents-free-png.png"
                  alt="Folder documents"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                marginBottom: '0.75rem'
              }}>
                Mock Interview Setup
              </h1>
              
              <p style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0
              }}>
                Customize your interview to match real-world hiring scenarios.
              </p>
            </div>
          </div>

          {/* Setup Form - interview setup form */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem',
            marginTop: '2rem'
          }}>
            {/* Step 1: Choose Focus Areas */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  1
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0
                }}>
                  Choose an focus areas
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {focusAreas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedFocus(area.id)}
                    style={{
                      padding: '1rem',
                      backgroundColor: selectedFocus === area.id ? '#e0f2fe' : 'white',
                      border: selectedFocus === area.id ? '2px solid #06b6d4' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: selectedFocus === area.id ? '#06b6d4' : '#6b7280',
                      fontWeight: selectedFocus === area.id ? '600' : '400',
                      transition: 'all 0.2s',
                      minHeight: '56px',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>{area.icon}</span>
                    <span style={{ fontSize: '0.8rem' }}>{area.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Job Role */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  2
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0
                }}>
                  Select job role
                </h3>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedJobRole}
                    onChange={(e) => setSelectedJobRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem 3rem 1rem 1rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      color: selectedJobRole ? '#374151' : '#9ca3af',
                      cursor: 'pointer',
                      appearance: 'none'
                    }}
                  >
                    <option value="">Job role selection</option>
                    <option value="software-engineer">Software Engineer</option>
                    <option value="frontend-developer">Frontend Developer</option>
                    <option value="backend-developer">Backend Developer</option>
                    <option value="fullstack-developer">Full Stack Developer</option>
                    <option value="data-scientist">Data Scientist</option>
                    <option value="product-manager">Product Manager</option>
                    <option value="ui-ux-designer">UI/UX Designer</option>
                  </select>
                  
                  {/* Custom dropdown arrow */}
                  <div style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#06b6d4">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </div>
                </div>
                
                <div style={{
                  textAlign: 'right',
                  marginTop: '0.5rem'
                }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#06b6d4',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}>
                    Job role not listed?
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Select User Response */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  3
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0
                }}>
                  Select user response
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <button
                  onClick={() => setSelectedResponse('text')}
                  style={{
                    padding: '2rem 1.5rem',
                    backgroundColor: selectedResponse === 'text' ? '#e0f2fe' : 'white',
                    border: selectedResponse === 'text' ? '2px solid #06b6d4' : '1px solid #d1d5db',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={selectedResponse === 'text' ? '#06b6d4' : '#6b7280'}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: selectedResponse === 'text' ? '#06b6d4' : '#6b7280'
                  }}>
                    Text
                  </span>
                </button>
                
                <button
                  onClick={() => setSelectedResponse('voice')}
                  style={{
                    padding: '2rem 1.5rem',
                    backgroundColor: selectedResponse === 'voice' ? '#e0f2fe' : 'white',
                    border: selectedResponse === 'voice' ? '2px solid #06b6d4' : '1px solid #d1d5db',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={selectedResponse === 'voice' ? '#06b6d4' : '#6b7280'}>
                    <path d="M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: selectedResponse === 'voice' ? '#06b6d4' : '#6b7280'
                  }}>
                    Voice
                  </span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '3rem'
            }}>
              <button style={{
                width: '100%',
                padding: '1rem 2rem',
                backgroundColor: '#f8fafc',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                More Settings
              </button>
              
              <button 
                onClick={() => {
                  if (selectedResponse === 'voice') {
                    // Store interview configuration
                    sessionStorage.setItem('interviewConfig', JSON.stringify({
                      focus: selectedFocus,
                      jobRole: selectedJobRole,
                      responseType: selectedResponse
                    }));
                    navigate('/voice-interview');
                  } else {
                    // Handle text interview (future implementation)
                    console.log('Text interview not implemented yet');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAIInterview;