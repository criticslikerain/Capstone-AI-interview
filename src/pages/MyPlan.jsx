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
  ChevronRight
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const MyPlan = ({ onLogout }) => {
  const router = useRouter();

  const handleNavigation = (itemId) => {
    switch (itemId) {
      case 'dashboard':
        router.push('/user-dashboard');
        break;
      case 'live-interview':
        router.push('/live-ai-interview-content-page');
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
              const isActive = item.id === 'subscriptions'; // Subscriptions is active

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

      {/* Main Content - my plan interface */}
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
          {/* Header Section */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
            position: 'relative',
            paddingTop: '3rem',
            paddingBottom: '6rem',
            color: 'white',
            textAlign: 'center'
          }}>


            {/* Header content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '800px',
              margin: '0 auto',
              padding: '0 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              {/* Bill Icon */}
              <div style={{
                flexShrink: 0
              }}>
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                  {/* Bill/Receipt Background */}
                  <rect x="20" y="15" width="50" height="70" rx="4" fill="white" opacity="0.9" />
                  <rect x="25" y="20" width="40" height="3" rx="1.5" fill="#06b6d4" />
                  <rect x="25" y="28" width="30" height="2" rx="1" fill="#94a3b8" />
                  <rect x="25" y="33" width="35" height="2" rx="1" fill="#94a3b8" />
                  <rect x="25" y="38" width="25" height="2" rx="1" fill="#94a3b8" />

                  {/* Dollar Sign */}
                  <circle cx="65" cy="25" r="12" fill="#fbbf24" />
                  <text x="65" y="31" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>

                  {/* Calendar/Grid */}
                  <rect x="15" y="45" width="25" height="20" rx="2" fill="#8b5cf6" opacity="0.8" />
                  <line x1="18" y1="50" x2="37" y2="50" stroke="white" strokeWidth="1" />
                  <line x1="18" y1="55" x2="37" y2="55" stroke="white" strokeWidth="1" />
                  <line x1="18" y1="60" x2="37" y2="60" stroke="white" strokeWidth="1" />
                  <line x1="22" y1="47" x2="22" y2="63" stroke="white" strokeWidth="1" />
                  <line x1="27" y1="47" x2="27" y2="63" stroke="white" strokeWidth="1" />
                  <line x1="32" y1="47" x2="32" y2="63" stroke="white" strokeWidth="1" />
                </svg>
              </div>

              {/* Text content */}
              <div style={{ textAlign: 'left' }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  marginBottom: '0.75rem'
                }}>
                  My Plan
                </h1>

                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Manage your subscription plans and billing details here. View your current plan, track billing history, and make changes such as upgrading, downgrading, or canceling your subscription anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2rem',
            marginTop: '-3rem',
            position: 'relative',
            zIndex: 3
          }}>
            {/* Current Subscription Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#374151',
                margin: 0,
                marginBottom: '1.5rem'
              }}>
                Current Subscription
              </h2>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                {/* Plan Icon */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#fbbf24',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {/* Ribbon */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '16px',
                    backgroundColor: '#ef4444',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '8px', color: 'white', fontWeight: 'bold' }}>✓</span>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#06b6d4',
                      margin: 0
                    }}>
                      InterviewPro Monthly
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Active
                    </span>
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    Next billing date in 11th of March 2025
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#374151',
                margin: 0,
                marginBottom: '1.5rem'
              }}>
                Payment Method
              </h2>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  {/* GCash Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb'
                  }}>
                    <img
                      src="https://images.seeklogo.com/logo-png/38/1/gcash-logo-png_seeklogo-383190.png"
                      alt="GCash Logo"
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  <div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0,
                      marginBottom: '0.25rem'
                    }}>
                      GCash
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      margin: 0
                    }}>
                      ••••••••09
                    </p>
                  </div>
                </div>

                <button style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Change
                </button>
              </div>
            </div>

            {/* Billing History Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0
                }}>
                  Billing History
                </h2>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#06b6d4',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  See all
                  <ChevronRight size={16} />
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                {/* Date Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#06b6d4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>11</span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.25rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#06b6d4',
                      margin: 0
                    }}>
                      February 11, 2025
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Paid
                    </span>
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    PHP 399.00 via GCash
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <button style={{
                width: '100%',
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                Change Plan
              </button>

              <button style={{
                width: '100%',
                padding: '1rem 2rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlan;