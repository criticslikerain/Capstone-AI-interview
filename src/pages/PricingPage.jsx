import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Home, 
  Clock, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  User, 
  Settings,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const PricingPage = ({ onLogout }) => {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleNavigation = (itemId) => {
    switch(itemId) {
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

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: null,
      badge: 'FREE',
      badgeColor: '#06b6d4',
      borderColor: '#06b6d4',
      features: [
        { text: '5 mock interview sessions per month', included: true },
        { text: '20 Question bank sessions', included: true },
        { text: 'Basic interview feedback access', included: true },
        { text: 'Mock interview and question bank sessions renew every month', included: true, icon: RefreshCw },
        { text: 'No personalized coaching', included: false }
      ]
    },
    {
      id: 'monthly',
      name: 'P399 /month',
      price: 399,
      badge: null,
      badgeColor: '#fbbf24',
      borderColor: '#e5e7eb',
      features: [
        { text: 'Unlimited Live AI Interview Sessions', included: true },
        { text: 'Unlimited Question Bank Session', included: true },
        { text: 'Advanced interview feedback access', included: true },
        { text: 'Strength and Weakness Analysis', included: true }
      ]
    },
    {
      id: 'yearly',
      name: 'P3830 /year',
      price: 3830,
      badge: null,
      badgeColor: '#fbbf24',
      borderColor: '#e5e7eb',
      features: [
        { text: 'Unlimited Live AI Interview Sessions', included: true },
        { text: 'Unlimited Question Bank Sessions', included: true },
        { text: 'Advanced interview feedback access', included: true },
        { text: 'Strength and Weakness Analysis', included: true },
        { text: 'Save 20% when purchasing yearly', included: true, special: true }
      ]
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
              const isActive = item.id === 'subscriptions'; // Subscriptions is active for pricing
              
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

      {/* Main Content - pricing interface */}
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
            paddingBottom: '4rem',
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
              {/* Illustration */}
              <div style={{
                flexShrink: 0
              }}>
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                  {/* Trophy Base */}
                  <rect x="35" y="75" width="30" height="15" rx="2" fill="#fbbf24"/>
                  <rect x="30" y="85" width="40" height="8" rx="4" fill="#f59e0b"/>
                  
                  {/* Trophy Cup */}
                  <path d="M25 35 C25 25, 35 15, 50 15 C65 15, 75 25, 75 35 L75 55 C75 65, 65 75, 50 75 C35 75, 25 65, 25 55 Z" fill="#fbbf24"/>
                  
                  {/* Trophy Handles */}
                  <path d="M20 40 C15 40, 10 35, 10 30 C10 25, 15 20, 20 20 L25 20 L25 35 L20 35 C20 37, 20 40, 20 40 Z" fill="#f59e0b"/>
                  <path d="M80 40 C85 40, 90 35, 90 30 C90 25, 85 20, 80 20 L75 20 L75 35 L80 35 C80 37, 80 40, 80 40 Z" fill="#f59e0b"/>
                  
                  {/* Trophy Details */}
                  <circle cx="50" cy="45" r="15" fill="#fff" opacity="0.3"/>
                  <path d="M45 40 L50 50 L55 40 Z" fill="#fbbf24"/>
                  
                  {/* Sparkles */}
                  <circle cx="20" cy="15" r="2" fill="#fbbf24"/>
                  <circle cx="80" cy="20" r="1.5" fill="#f59e0b"/>
                  <circle cx="85" cy="10" r="1" fill="#fbbf24"/>
                  <circle cx="15" cy="25" r="1" fill="#f59e0b"/>
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
                  Unlock Your Full Potential
                </h1>
                
                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Gain unlimited access to personalized coaching, detailed feedback, and unlimited mock interviews.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Cards Section */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            marginTop: '-1rem',
            position: 'relative',
            zIndex: 3
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: `2px solid ${plan.borderColor}`,
                    position: 'relative'
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: plan.badgeColor,
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {plan.badge}
                    </div>
                  )}
                  
                  {/* Plan Icon */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: plan.badgeColor,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    position: 'relative'
                  }}>
                    {plan.id === 'free' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    )}
                    {plan.id !== 'free' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    )}
                    
                    {/* Crown for premium plans */}
                    {plan.id !== 'free' && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#fbbf24',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                          <path d="M5 16L3 3l5.5 5L12 4l3.5 4L21 3l-2 13H5z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Plan Name */}
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#374151',
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: '2rem'
                  }}>
                    {plan.name}
                  </h3>
                  
                  {/* Features List */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: feature.included ? 
                            (feature.special ? '#ef4444' : '#10b981') : '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '0.125rem'
                        }}>
                          {feature.included ? (
                            feature.icon ? (
                              <feature.icon size={12} color="white" />
                            ) : (
                              <Check size={12} color="white" />
                            )
                          ) : (
                            <X size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '0.875rem',
                          color: feature.included ? '#374151' : '#9ca3af',
                          lineHeight: '1.4'
                        }}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Description Text */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#6b7280',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              fontStyle: 'italic'
            }}>
              Practice for free with 5 mock interviews per month, 20 question bank sessions, and basic feedback. Ideal for building confidence at your own pace.
            </div>

            {/* Terms and Conditions */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginBottom: '2rem',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  marginTop: '0.125rem',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151',
                lineHeight: '1.4'
              }}>
                By checking this box, you acknowledge that you have read, understood, and agree to the{' '}
                <span style={{ color: '#06b6d4', textDecoration: 'underline', cursor: 'pointer' }}>
                  InterviewPro Terms and Conditions
                </span>
                , including the subscription, billing, and cancellation policies.
              </span>
            </div>

            {/* Get Started Button */}
            <button
              disabled={!agreedToTerms}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                backgroundColor: agreedToTerms ? '#374151' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: agreedToTerms ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;