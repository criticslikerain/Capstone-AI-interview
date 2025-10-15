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
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Lightbulb,
  Target
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const WeaknessOverview = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Problem-solving');

  const handleNavigation = (itemId) => {
    switch(itemId) {
      case 'dashboard':
        navigate('/user-dashboard');
        break;
      case 'live-interview':
        navigate('/live-ai-interview');
        break;
      case 'past-interviews':
        //=================================================
        // Para sa sunod nga update ni nato i-implement
        // Maghuwat sa lang usa ka
        //=================================================
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

  const questionCategories = [
    {
      id: 'behavioral',
      title: 'Behavioral Questions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" fill="white"/>
          <path d="M5 20C5 16.134 8.13401 13 12 13C15.866 13 19 16.134 19 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      color: '#ef4444'
    },
    {
      id: 'problem-solving',
      title: 'Problem-Solving Questions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
          <path d="M12 2V7M12 17V22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M2 12H7M17 12H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      color: '#f59e0b'
    },
    {
      id: 'situational',
      title: 'Situational Questions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#8b5cf6'
    }
  ];

  const improvementCategories = [
    { id: 'behavioral', label: 'Behavioral', active: false },
    { id: 'problem-solving', label: 'Problem-solving', active: true },
    { id: 'situational', label: 'Situational', active: false }
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      {/*==================================================
         * SIDEBAR SECTION
         * Kani kay ang nindot kaayo nga sidebar nato
         * Naa ni navigation ug logo sa app
         *================================================*/}
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
        {/*=================================================
           * DARK OVERLAY
           * Para medyo dark ang sidebar ug readable ang text
           *===============================================*/}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          zIndex: 1
        }}></div>
        
        {/*=================================================
           * SIDEBAR CONTENT WRAPPER
           * Kani kay container sa tanan content sa sidebar
           *===============================================*/}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          {/*=================================================
             * LOGO SECTION
             * Kani kay ang logo sa InterviewPro app nato
             * Naa ni icon ug text na InterviewPro
             *===============================================*/}
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

          {/*=================================================
             * NAVIGATION SECTION
             * Dinhi nato gi butang tanan navigation items
             * Para ma access ang lain-laing features
             *===============================================*/}
          <nav style={{ flex: 1, padding: '1rem 0' }}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'past-interviews'; // Past Interviews is active
              
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

      {/*=================================================
         * MAIN CONTENT SECTION
         * Kani kay main area sa weakness overview
         * Dinhi makita imong mga areas for improvement
         *===============================================*/}
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
          {/*=================================================
             * HEADER SECTION
             * Nindot kaayo nga gradient header ni nato
             * Naa ni curved bottom design pa gyud
             *===============================================*/}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
            position: 'relative',
            paddingTop: '3rem',
            paddingBottom: '6rem',
            color: 'white',
            textAlign: 'center'
          }}>
            {/*=================================================
               * CURVED BOTTOM DESIGN
               * SVG na curve para nindot tan-awon ang transition
               * Murag wave effect ang design
               *===============================================*/}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              overflow: 'hidden'
            }}>
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: 'rotate(180deg)'
                }}
              >
                <path
                  d="M0,0 C150,100 350,100 600,50 C850,0 1050,0 1200,50 L1200,120 L0,120 Z"
                  fill="#f9fafb"
                />
              </svg>
            </div>
            
            {/*=================================================
               * HEADER CONTENT
               * Main content sa header area
               * Naa dinhi ang title ug description
               *===============================================*/}
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
              {/*=================================================
                 * ILLUSTRATION
                 * Nindot nga illustration para sa weakness overview
                 * Para dili boring tan-awon
                 *===============================================*/}
              <div style={{
                flexShrink: 0
              }}>
                <img 
                  src="/assets/images/job_interview.png"
                  alt="Tired office worker"
                  style={{
                    width: '160px',
                    height: '160px',
                    objectFit: 'contain',
                    transform: 'scale(1.5)',
                    transformOrigin: 'center'
                  }}
                />
              </div>
              
              {/*=================================================
                 * TEXT CONTENT
                 * Dinhi nato gi butang ang title ug description
                 * Para ma explain unsay purpose ani nga page
                 *===============================================*/}
              <div style={{ textAlign: 'left' }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  marginBottom: '0.75rem'
                }}>
                  Weakness Overview
                </h1>
                
                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Identify key areas where you can improve and refine your interview performance. Learn from past responses and take actionable steps toward progress.
                </p>
              </div>
            </div>
          </div>

          {/*=================================================
             * CONTENT AREA
             * Main container sa content sa weakness overview
             * Dinhi makita ang detailed information
             *===============================================*/}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            marginTop: '-3rem',
            position: 'relative',
            zIndex: 3
          }}>
            {/* Key Weaknesses Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <AlertTriangle size={24} color="#f59e0b" />
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#374151',
                  margin: 0
                }}>
                  Key Weaknesses
                </h2>
              </div>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem',
                fontSize: '0.875rem'
              }}>
                Uncover your key areas for improvement and recognize where challenges arise the most. See how these weaknesses have been consistently observed across different interview scenarios.
              </p>

              {/* Weakness Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                {/* Lack of Clarity Card */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#1e293b',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>?</span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#06b6d4',
                    margin: 0,
                    marginBottom: '0.5rem'
                  }}>
                    Lack of Clarity in Responses
                  </h3>
                  
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    Identified as a weakness in 4 out of 5 interviews.
                  </p>
                </div>

                {/* Questions Card */}
                <div style={{
                  backgroundColor: '#f0f9ff',
                  border: '2px solid #0ea5e9',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <HelpCircle size={20} color="#0ea5e9" />
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#0ea5e9',
                      margin: 0
                    }}>
                      Questions Where This Weakness Was Highlighted
                    </h3>
                  </div>
                  
                  <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>• Tell me about a time you had to handle multiple priorities at once.</p>
                    <p style={{ margin: '0' }}>• How would you handle a disagreement with a team member?</p>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div style={{
                marginTop: '2rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <BarChart3 size={20} color="#374151" />
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0
                  }}>
                    Main Question Categories Contributing to this Weakness
                  </h4>
                </div>
                
                {/* Progress bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>Behavioral</span>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>60%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                      <div style={{ width: '60%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>Problem-Solving</span>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>30%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                      <div style={{ width: '30%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>Situational</span>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>10%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                      <div style={{ width: '10%', height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weakness by Question Category */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <Target size={24} color="#8b5cf6" />
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#374151',
                  margin: 0
                }}>
                  Weakness by Question Category
                </h2>
              </div>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem',
                fontSize: '0.875rem'
              }}>
                Tap on each card to reveal detailed insights about how this strength was demonstrated across different question categories.
              </p>

              {/* Category Cards */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {questionCategories.map((category) => (
                  <div
                    key={category.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.5rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: category.color,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        {category.icon}
                      </div>
                      <span style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {category.title}
                      </span>
                    </div>
                    <ChevronRight size={20} color="#9ca3af" />
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Improvement Plan */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <Lightbulb size={24} color="#f59e0b" />
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#374151',
                  margin: 0
                }}>
                  Personalized Improvement Plan
                </h2>
              </div>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem',
                fontSize: '0.875rem'
              }}>
                This section is designed to help users actively work on their weaknesses by providing interactive exercises.
              </p>

              {/* Category Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  marginBottom: '1rem'
                }}>
                  Select question category
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  {improvementCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.label)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: category.active ? '#06b6d4' : 'white',
                        color: category.active ? 'white' : '#6b7280',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercise Question */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <p style={{
                  fontSize: '1rem',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '1rem'
                }}>
                  Describe a time when you faced an unexpected obstacle in a project. How did you resolve it?
                </p>
                
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Start
                </button>
              </div>

              {/* Tip */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #f59e0b'
              }}>
                <Lightbulb size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#92400e',
                    margin: 0,
                    marginBottom: '0.25rem'
                  }}>
                    Tip:
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#92400e',
                    margin: 0
                  }}>
                    Focus on how you identified the root cause, explored different solutions, and took decisive action. Highlight a positive outcome.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeaknessOverview;