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
  BarChart3,
  Calendar,
  MessageCircle,
  Star
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const UserDashboard = ({ onLogout }) => {
  const navigate = useNavigate();

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
              const isActive = item.id === 'dashboard'; // Dashboard is active by default
              
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
          {/* Header Section with Greeting - header nga nindot */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
            padding: '2rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <img
                src="https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-6/332894731_871500290627490_9114427192078729508_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEIQK4MFgnnRT9WfUg2B6s136FuOVzB0ezfoW45XMHR7GLHbu64z4xh439aJE-Nbc3U3zbd5CTvoo94jdtMy3N9&_nc_ohc=NcggS-PF0-YQ7kNvwEnFr6M&_nc_oc=AdmeDZmzyHsvb6r0FV2ZRFXlM9ivTKJ6uCa92aRo5yfmBZx-PSHmFy6Cy2WeumNPo3E&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&_nc_gid=YkQdYl3LxA2evXlqFcpT-A&oh=00_AfUgs_cUtw8mcGo5D5X2VU8M7Y4nPEiFGcH52XLOnN2pUg&oe=689D38F6"
                alt="User Profile"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid rgba(255, 255, 255, 0.3)'
                }}
              />
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  Good Day,
                </h1>
                <p style={{
                  fontSize: '1.5rem',
                  color: '#06b6d4',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  John!
                </p>
              </div>
            </div>
            
            {/* Notification Bell - notification icon */}
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </div>
          </div>

          {/* Main Content Area - main content diri */}
          <div style={{ padding: '2rem' }}>
            {/* Performance Snapshot Card - performance snapshot */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <BarChart3 size={24} color="#06b6d4" />
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#06b6d4',
                  margin: 0
                }}>
                  Performance Snapshot
                </h2>
              </div>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem',
                fontSize: '1rem'
              }}>
                You've completed 4 interviews this week. Keep going!
              </p>

              {/* Performance Stats Grid - mga stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem'
              }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Average Rating Card */}
                  <div style={{
                    backgroundColor: '#06b6d4',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <Star size={20} fill="white" />
                      <span style={{ fontSize: '0.875rem' }}>Average Rating</span>
                    </div>
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      4.3
                    </div>
                  </div>

                  {/* Best Answered Question */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <MessageCircle size={16} color="#374151" />
                      <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
                        Best Answered Question
                      </span>
                    </div>
                    <p style={{
                      color: '#06b6d4',
                      fontSize: '0.875rem',
                      margin: 0
                    }}>
                      Tell me about yourself?
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Best Score */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    textAlign: 'right'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
                        Best Score
                      </span>
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#06b6d4'
                    }}>
                      4
                    </div>
                  </div>

                  {/* Last Practice Date */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    textAlign: 'right'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <Calendar size={16} color="#374151" />
                      <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
                        Last Practice Date
                      </span>
                    </div>
                    <p style={{
                      color: '#06b6d4',
                      fontSize: '0.875rem',
                      margin: 0
                    }}>
                      Feb 14, 2025
                    </p>
                  </div>

                  {/* Average Response Length */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    textAlign: 'right'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <Clock size={16} color="#374151" />
                      <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
                        Average Response Length
                      </span>
                    </div>
                    <p style={{
                      color: '#06b6d4',
                      fontSize: '0.875rem',
                      margin: 0
                    }}>
                      48 seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Past Interviews Section - past interviews */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#06b6d4',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#06b6d4',
                  margin: 0
                }}>
                  My Past Interviews
                </h2>
              </div>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}>
                Review your previous interview sessions and identify areas for improvement based on past performance.
              </p>

              {/* Interview List - mga past interviews */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {/* Interview 1 - Situational Interview */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.25rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1.25rem',
                    flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>4</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#3b82f6',
                      margin: 0,
                      marginBottom: '0.75rem'
                    }}>
                      Situational Interview Pract...
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ color: '#fbbf24', fontSize: '1rem' }}>★★★★</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        <span>Feb 3, 2024</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <HelpCircle size={14} />
                        <span>4 Questions</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>✏️</span>
                        <span>Situational</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interview 2 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.25rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1.25rem',
                    flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>4</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#3b82f6',
                      margin: 0,
                      marginBottom: '0.75rem'
                    }}>
                      Interview 2
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ color: '#fbbf24', fontSize: '1rem' }}>★★★★</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        <span>Feb 2, 2024</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <HelpCircle size={14} />
                        <span>10 Questions</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>✏️</span>
                        <span>Behavioral</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interview 3 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.25rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1.25rem',
                    flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>3</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#3b82f6',
                      margin: 0,
                      marginBottom: '0.75rem'
                    }}>
                      Soft Eng. Practice
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ color: '#fbbf24', fontSize: '1rem' }}>★★★</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        <span>Feb 1, 2024</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <HelpCircle size={14} />
                        <span>15 Questions</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>✏️</span>
                        <span>Full Interview</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Mock Interview Button - button para sa mock interview */}
              <div style={{ marginTop: '2rem' }}>
                <button style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                }}>
                  <Zap size={20} />
                  Start Mock Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;