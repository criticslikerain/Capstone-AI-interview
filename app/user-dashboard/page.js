'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3,
  Calendar,
  MessageCircle,
  Star,
  Clock,
  HelpCircle,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../../components/Sidebar'

export default function UserDashboard() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, userProfile, getInitials, getFullName } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchSessions()
  }, [user, router])

  const fetchSessions = async () => {
    try {
      if (!user) return
      
      const token = await user.getIdToken()
      const response = await fetch('/api/interviews/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .spinner {
            animation: spin 1s linear infinite;
          }
          .pulse-text {
            animation: pulse 2s ease-in-out infinite;
          }
        `}</style>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div 
              className="spinner"
              style={{
                width: '64px',
                height: '64px',
                border: '6px solid #e5e7eb',
                borderTop: '6px solid #06b6d4',
                borderRadius: '50%',
                margin: '0 auto',
                marginBottom: '1.5rem'
              }}
            ></div>
            <p 
              className="pulse-text"
              style={{ 
                marginTop: '1rem', 
                color: '#374151',
                fontSize: '1.125rem',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Loading dashboard...
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#06b6d4',
                borderRadius: '50%',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#06b6d4',
                borderRadius: '50%',
                animation: 'pulse 1.5s ease-in-out infinite 0.2s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#06b6d4',
                borderRadius: '50%',
                animation: 'pulse 1.5s ease-in-out infinite 0.4s'
              }}></div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <Sidebar activeItem="dashboard" />

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
          {/* Header Section with Greeting */}
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
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {getInitials()}
              </div>
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
                  {getFullName().split(' ')[0] || 'User'}!
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0
                }}>
                  {userProfile?.email}
                </p>
              </div>
            </div>
            

          </div>

          {/* Main Content Area */}
          <div style={{ padding: '2rem' }}>
            {/* Performance Snapshot Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem'
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
                You've completed {sessions.filter(s => s.status === 'completed').length} interviews. Keep going!
              </p>

              {/* Performance Stats Grid */}
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

            {/* My Past Interviews Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem'
              }}>
                <img
                  src="/assets/images/weakness_overview.png"
                  alt="Past Interviews"
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain'
                  }}
                />
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

              {/* Interview List */}
              {sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No interview sessions yet.</p>
                  <button
                    onClick={() => router.push('/live-ai-interview-content-page')}
                    style={{
                      backgroundColor: '#06b6d4',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Start Your First Interview
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {sessions.slice(0, 3).map((session, index) => (
                    <div key={session.id} style={{
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
                        <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                          {session.overall_score || (4 - index)}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#3b82f6',
                          margin: 0,
                          marginBottom: '0.75rem'
                        }}>
                          {session.session_name || `Interview ${index + 1}`}
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
                            <span>{new Date(session.created_at).toLocaleDateString()}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <HelpCircle size={14} />
                            <span>Questions</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span>✏️</span>
                            <span>{session.interview_type || 'General'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Start Mock Interview Button */}
              <div style={{ marginTop: '2rem' }}>
                <button 
                  onClick={() => router.push('/live-ai-interview-content-page')}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                  }}
                >
                  <Zap size={20} />
                  Start Mock Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}