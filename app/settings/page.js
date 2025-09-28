'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home,
  Clock,
  Zap,
  HelpCircle,
  CreditCard,
  User,
  Settings,
  ChevronRight,
  Info
} from 'lucide-react'
import ChatBubbleLogo from '../../components/ChatBubbleLogo'

export default function SettingsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [buttonlessResponse, setButtonlessResponse] = useState(true)
  const [aiTextCaptions, setAiTextCaptions] = useState(true)
  const [autoPlayQuestions, setAutoPlayQuestions] = useState(true)
  const [speakingSpeed, setSpeakingSpeed] = useState('Normal')
  const [instantRating, setInstantRating] = useState(true)
  const [retryAnswer, setRetryAnswer] = useState(true)

  const handleNavigation = (itemId) => {
    switch (itemId) {
      case 'dashboard':
        router.push('/user-dashboard')
        break
      case 'live-interview':
        router.push('/live-ai-interview')
        break
      case 'past-interviews':
        router.push('/weakness-overview')
        break
      case 'question-bank':
        router.push('/question-bank')
        break
      case 'subscriptions':
        router.push('/my-plan')
        break
      case 'profile':
        router.push('/profile')
        break
      case 'settings':
        router.push('/settings')
        break
      default:
        break
    }
  }

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'past-interviews', icon: Clock, label: 'Past Interviews' },
    { id: 'live-interview', icon: Zap, label: 'Live AI Interview' },
    { id: 'question-bank', icon: HelpCircle, label: 'Question Bank' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <div
      onClick={onToggle}
      style={{
        width: '48px',
        height: '24px',
        backgroundColor: enabled ? '#06b6d4' : '#d1d5db',
        borderRadius: '12px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: enabled ? '26px' : '2px',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      />
    </div>
  )

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
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
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          zIndex: 1
        }}></div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
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

          <nav style={{ flex: 1, padding: '1rem 0' }}>
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = item.id === 'settings'

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
                    if (!isActive) e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.7)'
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.target.style.backgroundColor = 'transparent'
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
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
              <div style={{
                flexShrink: 0
              }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/214/214342.png"
                  alt="Settings Icon"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'contain'
                  }}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  marginBottom: '0.75rem'
                }}>
                  Settings
                </h1>

                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Customize your InterviewPro experience. Manage your preferences, and app settings—all in one place.
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
            {/* App Theme Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#06b6d4',
                margin: 0,
                marginBottom: '1.5rem'
              }}>
                App Theme
              </h2>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 0'
              }}>
                <span style={{
                  fontSize: '1rem',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Enable dark mode
                </span>
                <ToggleSwitch
                  enabled={darkMode}
                  onToggle={() => setDarkMode(!darkMode)}
                />
              </div>
            </div>

            {/* Interview Customizations Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#06b6d4',
                margin: 0,
                marginBottom: '1.5rem'
              }}>
                Interview Customizations
              </h2>

              {/* Turn on Button-less Response */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '1rem 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '1rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      Turn on Button-less Response
                    </span>
                    <Info size={16} color="#06b6d4" />
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    When enabled, the user no longer needs to tap the microphone button to respond. This system will automatically detect speech and begin recording as soon as the user starts speaking.
                  </p>
                </div>
                <ToggleSwitch
                  enabled={buttonlessResponse}
                  onToggle={() => setButtonlessResponse(!buttonlessResponse)}
                />
              </div>

              {/* Turn off AI Interviewer Text Captions */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '1rem 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '1rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      Turn off AI Interviewer Text Captions
                    </span>
                    <Info size={16} color="#06b6d4" />
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    When enabled, the questions will not be displayed as text on the screen. This setting is useful for users who want to simulate a real-life interview experience, relying only on the AI's voice without reading the text.
                  </p>
                </div>
                <ToggleSwitch
                  enabled={aiTextCaptions}
                  onToggle={() => setAiTextCaptions(!aiTextCaptions)}
                />
              </div>

              {/* Auto-Play Interviewer Questions */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '1rem 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '1rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      Auto-Play Interviewer Questions
                    </span>
                    <Info size={16} color="#06b6d4" />
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    When enabled, the AI will automatically start speaking the next question without requiring user to press "Next Question" button.
                  </p>
                </div>
                <ToggleSwitch
                  enabled={autoPlayQuestions}
                  onToggle={() => setAutoPlayQuestions(!autoPlayQuestions)}
                />
              </div>

              {/* Adjust AI Speaking Speed */}
              <div style={{
                padding: '1rem 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <span style={{
                  fontSize: '1rem',
                  color: '#374151',
                  fontWeight: '500',
                  display: 'block',
                  marginBottom: '1rem'
                }}>
                  Adjust AI Speaking Speed
                </span>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  {['Slow', 'Normal', 'Fast'].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSpeakingSpeed(speed)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: speakingSpeed === speed ? '#06b6d4' : 'white',
                        color: speakingSpeed === speed ? 'white' : '#6b7280',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enable Instant AI Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '1rem 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '1rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      Enable Instant AI Rating
                    </span>
                    <Info size={16} color="#06b6d4" />
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    When enabled, the AI interviewer will immediately rate the user's response after each question, providing a score and brief feedback before moving to the next question. Disabling this feature will only show ratings at the end of the interview.
                  </p>
                </div>
                <ToggleSwitch
                  enabled={instantRating}
                  onToggle={() => setInstantRating(!instantRating)}
                />
              </div>

              {/* Enable Retry Answer Option */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '1rem 0'
              }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '1rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      Enable Retry Answer Option
                    </span>
                    <Info size={16} color="#06b6d4" />
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    When enabled, Users can redo their response for a question before moving to the next one.
                  </p>
                </div>
                <ToggleSwitch
                  enabled={retryAnswer}
                  onToggle={() => setRetryAnswer(!retryAnswer)}
                />
              </div>
            </div>

            {/* Additional Options */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Frequently Asked Questions */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#06b6d4',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <HelpCircle size={20} color="white" />
                  </div>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Frequently Asked Questions
                  </span>
                </div>
                <ChevronRight size={20} color="#9ca3af" />
              </div>

              {/* App Information */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#06b6d4',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Info size={20} color="white" />
                  </div>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    App Information
                  </span>
                </div>
                <ChevronRight size={20} color="#9ca3af" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}