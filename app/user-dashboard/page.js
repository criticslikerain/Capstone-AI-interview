'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
import { getInterviewSessions, db } from '../../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function UserDashboard() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, userProfile, loading: authLoading } = useAuth()
  const [localUserProfile, setLocalUserProfile] = useState(null)
  const [expandedSession, setExpandedSession] = useState(null)
  const [showAllInterviews, setShowAllInterviews] = useState(false)
  const [bestQuestionBankAnswer, setBestQuestionBankAnswer] = useState(null)
  
  const getInitials = () => {
    const profile = userProfile || localUserProfile
    if (!profile) return 'U'
    const firstName = profile.first_name || profile.firstName || ''
    const lastName = profile.last_name || profile.lastName || ''
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
  }

  const getFullName = () => {
    const profile = userProfile || localUserProfile
    if (!profile) return 'User'
    const firstName = profile.first_name || profile.firstName || ''
    const lastName = profile.last_name || profile.lastName || ''
    return `${firstName} ${lastName}`.trim()
  }
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth...')
      
      // Check JWT token cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]
      
      console.log('Has Firebase user:', !!user)
      console.log('Has JWT token:', !!token)
      
      // If we have Firebase user, we're good
      if (user) {
        console.log('Firebase user authenticated')
        setLoading(false)
        fetchSessions()
        return
      }
      
      // If we have JWT token, fetch user profile
      if (token) {
        console.log('Fetching user from JWT token')
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await res.json()
          console.log('User data from API:', data)
          
          if (data.user) {
            setLocalUserProfile(data.user)
            setLoading(false)
            fetchSessions()
            return
          }
        } catch (err) {
          console.error('Error fetching user:', err)
        }
      }
      
      // No authentication found, redirect to login
      console.log('No authentication found, redirecting to login')
      router.push('/login')
    }
    
    checkAuth()
  }, [user, router])

  const fetchSessions = async () => {
    try {
      const currentUser = user || localUserProfile
      if (!currentUser) {
        console.log('No user found for fetching sessions')
        return
      }
      
      const userId = currentUser.uid || currentUser.id
      console.log('Fetching sessions for user ID:', userId)
      console.log('Current user object:', currentUser)
      
      const interviewSessions = await getInterviewSessions(userId)
      console.log('Fetched interview sessions:', interviewSessions)
      
      // Remove duplicates based on timestamp and topic
      const uniqueSessions = interviewSessions.reduce((acc, current) => {
        const isDuplicate = acc.find(item => {
          const itemTime = item.created_at?.toDate ? item.created_at.toDate().getTime() : new Date(item.created_at).getTime()
          const currentTime = current.created_at?.toDate ? current.created_at.toDate().getTime() : new Date(current.created_at).getTime()
          const timeDiff = Math.abs(itemTime - currentTime)
          
          // Consider duplicate if same topic and within 5 seconds
          return item.topic === current.topic && timeDiff < 5000
        })
        
        if (!isDuplicate) {
          acc.push(current)
        }
        return acc
      }, [])
      
      console.log('Unique sessions after deduplication:', uniqueSessions)
      setSessions(uniqueSessions)
      
      await fetchBestQuestionBankAnswer(userId)
    } catch (error) {
      console.error('Error fetching sessions:', error)
      setSessions([])
    }
  }

  const fetchBestQuestionBankAnswer = async (userId) => {
    try {
      const answersRef = collection(db, 'question_answers')
      const q = query(answersRef, where('user_id', '==', userId))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        let bestAnswer = null
        let highestScore = 0
        
        snapshot.forEach((doc) => {
          const data = doc.data()
          if (data.score && data.score > highestScore) {
            highestScore = data.score
            bestAnswer = {
              question: data.question,
              answer: data.answer,
              score: data.score
            }
          }
        })
        
        setBestQuestionBankAnswer(bestAnswer)
      }
    } catch (error) {
      console.error('Error fetching best question bank answer:', error)
    }
  }

  // Calculate real statistics from sessions
  const calculateStats = () => {
    if (sessions.length === 0) {
      return {
        averageScore: 0,
        bestScore: 0,
        lastPracticeDate: 'No interviews yet',
        averageResponseLength: 0,
        bestAnsweredQuestion: 'Complete an interview to see results'
      }
    }

    // Calculate average score
    const totalScore = sessions.reduce((sum, s) => sum + (s.percentage_scored || 0), 0)
    const averageScore = (totalScore / sessions.length).toFixed(1)

    const bestScore = Math.max(...sessions.map(s => s.percentage_scored || 0))

    // Get last practice date
    const sortedByDate = [...sessions].sort((a, b) => {
      const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at)
      const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at)
      return dateB - dateA
    })
    const lastDate = sortedByDate[0]?.created_at
    const lastPracticeDate = lastDate?.toDate 
      ? lastDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : new Date(lastDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    // Calculate average response length (if conversation data exists)
    let averageResponseLength = 0
    let totalResponses = 0
    let totalLength = 0
    
    sessions.forEach(session => {
      if (session.conversation && Array.isArray(session.conversation)) {
        const userResponses = session.conversation.filter(msg => msg.type === 'user')
        userResponses.forEach(response => {
          totalLength += (response.text || '').split(' ').length
          totalResponses++
        })
      }
    })
    
    if (totalResponses > 0) {
      averageResponseLength = Math.round(totalLength / totalResponses)
    }

    let bestAnsweredQuestion = 'Complete an interview to see results'
    let bestAnswerText = ''
    let bestAnswerScore = 0
    
    if (bestQuestionBankAnswer) {
      bestAnsweredQuestion = bestQuestionBankAnswer.question
      bestAnswerText = bestQuestionBankAnswer.answer
      bestAnswerScore = bestQuestionBankAnswer.score
    } else {
      const bestSession = sessions.find(s => s.percentage_scored === bestScore)
      if (bestSession?.conversation && Array.isArray(bestSession.conversation)) {
        const firstQuestion = bestSession.conversation.find(msg => msg.type === 'ai')
        if (firstQuestion?.text) {
          bestAnsweredQuestion = firstQuestion.text
        }
      }
    }

    return {
      averageScore,
      bestScore: Math.round(bestScore),
      lastPracticeDate,
      averageResponseLength,
      bestAnsweredQuestion,
      bestAnswerText,
      bestAnswerScore
    }
  }

  const stats = calculateStats()

  if (loading && !localUserProfile) {
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
                  {(userProfile || localUserProfile)?.email}
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
                You've completed {sessions.length} interview{sessions.length !== 1 ? 's' : ''}. Keep going!
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
                      {stats.averageScore}
                    </div>
                  </div>

                  {/* Best Answered Question */}
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '2px solid #10b981'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <MessageCircle size={16} color="#059669" />
                        <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>
                          Best Answered Question
                        </span>
                      </div>
                      {stats.bestAnswerScore > 0 && (
                        <div style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          {stats.bestAnswerScore}/10
                        </div>
                      )}
                    </div>
                    <p style={{
                      color: '#065f46',
                      fontSize: '0.875rem',
                      margin: 0,
                      marginBottom: stats.bestAnswerText ? '0.5rem' : 0,
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {stats.bestAnsweredQuestion}
                    </p>
                    {stats.bestAnswerText && (
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        margin: 0,
                        fontStyle: 'italic',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        "{stats.bestAnswerText}"
                      </p>
                    )}
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
                      {stats.bestScore}
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
                      {stats.lastPracticeDate}
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
                      {stats.averageResponseLength > 0 ? `${stats.averageResponseLength} words` : 'N/A'}
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
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain'
                  }}
                >
                  <path
                    d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z"
                    fill="#06b6d4"
                  />
                </svg>
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
                <>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {(showAllInterviews ? sessions : sessions.slice(0, 3)).map((session, index) => {
                    const score = session.percentage_scored || session.overall_score || 0
                    const date = session.created_at?.toDate ? session.created_at.toDate() : new Date(session.created_at)
                    const isExpanded = expandedSession === session.id
                    
                    return (
                      <div key={session.id} style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden'
                      }}>
                        {/* Main Interview Card */}
                        <div 
                          onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1.25rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
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
                            <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                              {Math.round(score)}%
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
                              {session.topic || session.session_name || session.interview_type || `Interview ${index + 1}`}
                            </h3>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1.5rem',
                              fontSize: '0.875rem',
                              color: '#64748b'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={14} />
                                <span>{date.toLocaleDateString()}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span>Score: {Math.round(score)}%</span>
                              </div>
                              {session.interview_type && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  <span>{session.interview_type}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{
                            marginLeft: '1rem',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div style={{
                            padding: '1.5rem',
                            backgroundColor: 'white',
                            borderTop: '1px solid #e2e8f0'
                          }}>
                            {/* Scores Grid */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(4, 1fr)',
                              gap: '1rem',
                              marginBottom: '1.5rem'
                            }}>
                              {session.communicationScore && (
                                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0284c7' }}>
                                    {session.communicationScore}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                    Communication
                                  </div>
                                </div>
                              )}
                              {session.confidenceScore && (
                                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                                    {session.confidenceScore}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                    Confidence
                                  </div>
                                </div>
                              )}
                              {session.relevanceScore && (
                                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ca8a04' }}>
                                    {session.relevanceScore}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                    Relevance
                                  </div>
                                </div>
                              )}
                              {session.clarityScore > 0 && (
                                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fce7f3', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#db2777' }}>
                                    {session.clarityScore}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                    Clarity
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Detailed Analysis */}
                            {session.detailedAnalysis && (
                              <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10 9 9 9 8 9"/>
                                  </svg>
                                  Detailed Analysis
                                </h4>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                                  {session.detailedAnalysis}
                                </p>
                              </div>
                            )}

                            {/* Strengths */}
                            {session.analysis?.strengths && session.analysis.strengths.length > 0 && (
                              <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#16a34a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                  Strengths
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                  {session.analysis.strengths.map((strength, i) => (
                                    <li key={i} style={{ marginBottom: '0.25rem' }}>{strength}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Improvements */}
                            {session.analysis?.improvements && session.analysis.improvements.length > 0 && (
                              <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                  </svg>
                                  Areas for Improvement
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                  {session.analysis.improvements.map((improvement, i) => (
                                    <li key={i} style={{ marginBottom: '0.25rem' }}>{improvement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Recommendations */}
                            {session.analysis?.recommendations && session.analysis.recommendations.length > 0 && (
                              <div>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0284c7', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0284c7" stroke="none">
                                    <circle cx="12" cy="12" r="10" fill="#0284c7"/>
                                    <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                  Recommendations
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                  {session.analysis.recommendations.map((rec, i) => (
                                    <li key={i} style={{ marginBottom: '0.25rem' }}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Conversation Preview */}
                            {session.conversation && session.conversation.length > 0 && (
                              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                  </svg>
                                  Conversation ({session.conversation.length} messages)
                                </h4>
                                <div style={{ maxHeight: '300px', overflowY: 'auto', fontSize: '0.875rem' }}>
                                  {session.conversation.slice(0, 6).map((msg, i) => (
                                    <div key={i} style={{
                                      padding: '0.75rem',
                                      marginBottom: '0.5rem',
                                      backgroundColor: msg.type === 'ai' ? '#f0f9ff' : '#f0fdf4',
                                      borderRadius: '6px'
                                    }}>
                                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {msg.type === 'ai' ? (
                                          <>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                                              <rect x="3" y="11" width="18" height="10" rx="2"/>
                                              <circle cx="12" cy="5" r="2"/>
                                              <path d="M12 7v4"/>
                                              <line x1="8" y1="16" x2="8" y2="16"/>
                                              <line x1="16" y1="16" x2="16" y2="16"/>
                                            </svg>
                                            <span style={{ color: '#0284c7' }}>Interviewer</span>
                                          </>
                                        ) : (
                                          <>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                              <circle cx="12" cy="7" r="4"/>
                                            </svg>
                                            <span style={{ color: '#16a34a' }}>You</span>
                                          </>
                                        )}
                                      </div>
                                      <div style={{ color: '#6b7280' }}>{msg.text}</div>
                                    </div>
                                  ))}
                                  {session.conversation.length > 6 && (
                                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                      ... and {session.conversation.length - 6} more messages
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* View All / Show Less Button */}
                {sessions.length > 3 && (
                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => setShowAllInterviews(!showAllInterviews)}
                      style={{
                        padding: '0.75rem 2rem',
                        backgroundColor: 'white',
                        color: '#06b6d4',
                        border: '2px solid #06b6d4',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#06b6d4'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.color = '#06b6d4'
                      }}
                    >
                      {showAllInterviews ? `Show Less` : `View All ${sessions.length} Interviews`}
                    </button>
                  </div>
                )}
                </>
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