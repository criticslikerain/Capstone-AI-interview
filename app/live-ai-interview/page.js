'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { canStartInterview, incrementInterviewCount } from '../../lib/subscriptionLimits'

export default function LiveAIInterview() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedInterviewType, setSelectedInterviewType] = useState('behavioral')
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate')
  const [voiceRecording, setVoiceRecording] = useState(true)
  const [videoRecording, setVideoRecording] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [usageInfo, setUsageInfo] = useState(null)
  const [showLimitModal, setShowLimitModal] = useState(false)

  useEffect(() => {
    const category = sessionStorage.getItem('interviewCategory')
    if (category) {
      setSelectedCategory(category)
    } else {
      router.push('/live-ai-interview-content-page')
    }
    
    if (user) {
      checkUsage()
    }
  }, [user])

  const checkUsage = async () => {
    if (!user) return
    const usage = await canStartInterview(user.uid)
    setUsageInfo(usage)
  }

  const handleStartInterview = async () => {
    if (!user) return
    
    const canStart = await canStartInterview(user.uid)
    
    if (!canStart.allowed) {
      setShowLimitModal(true)
      return
    }
    
    await incrementInterviewCount(user.uid)
    
    sessionStorage.setItem('interviewConfig', JSON.stringify({
      category: selectedCategory,
      interviewType: selectedInterviewType,
      difficulty: selectedDifficulty,
      voiceRecording,
      videoRecording
    }))
    
    router.push('/voice-interview')
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* Back Button - Fixed at top left */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 20
      }}>
        <button
          onClick={() => router.push('/live-ai-interview-content-page')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            color: '#6b7280',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#f9fafb'
            e.target.style.borderColor = '#d1d5db'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
            e.target.style.borderColor = '#e5e7eb'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7"/>
          </svg>
          Change Category
        </button>
      </div>

      {/* 3D Robot Section */}
      <div style={{
        flex: '0 0 400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          width: '350px',
          aspectRatio: '1 / 1',
          border: 'none',
          overflow: 'hidden',
          borderRadius: '10px',
          position: 'relative'
        }}>
          <iframe
            src="https://my.spline.design/genkubgreetingrobot-dKSdmkp6P4tsfaGKQgqQXWPd/"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="fullscreen; vr"
          ></iframe>
          {/* White mask to cover Spline copyright */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '350px',
            height: '45px',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            zIndex: 10
          }}></div>
        </div>
      </div>

      {/* Interview Setup Form */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '700px',
          width: '100%',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Live AI Interview
          </h1>
          
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            Set up your personalized interview experience
          </p>

          {selectedCategory && (
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#e0f2fe',
              border: '1px solid #06b6d4',
              borderRadius: '6px',
              marginBottom: '1.5rem'
            }}>
              <span style={{
                fontSize: '0.875rem',
                color: '#06b6d4',
                fontWeight: '600'
              }}>
                Category: {selectedCategory.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
          )}

          {/* Interview Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '0.75rem'
            }}>
              Interview Type
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem'
            }}>
              {['behavioral', 'technical', 'situational'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedInterviewType(type)}
                  style={{
                    padding: '1rem 0.75rem',
                    backgroundColor: selectedInterviewType === type ? '#e0f2fe' : 'white',
                    border: selectedInterviewType === type ? '2px solid #06b6d4' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    minHeight: '80px'
                  }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: selectedInterviewType === type ? '#06b6d4' : '#1f2937',
                    marginBottom: '0.25rem',
                    textTransform: 'capitalize'
                  }}>
                    {type}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: '1.3'
                  }}>
                    {type === 'behavioral' && 'Past experiences and behavior'}
                    {type === 'technical' && 'Technical skills and problems'}
                    {type === 'situational' && 'Hypothetical scenarios'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '0.75rem'
            }}>
              Difficulty Level
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem'
            }}>
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  style={{
                    padding: '1rem 0.75rem',
                    backgroundColor: selectedDifficulty === level ? '#e0f2fe' : 'white',
                    border: selectedDifficulty === level ? '2px solid #06b6d4' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    minHeight: '80px'
                  }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: selectedDifficulty === level ? '#06b6d4' : '#1f2937',
                    marginBottom: '0.25rem',
                    textTransform: 'capitalize'
                  }}>
                    {level}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    {level === 'beginner' && 'Entry-level questions'}
                    {level === 'intermediate' && 'Mid-level professional'}
                    {level === 'advanced' && 'Senior-level challenging'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interview Settings */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '0.75rem'
            }}>
              Interview Settings
            </h3>
            <div style={{
              display: 'flex',
              gap: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: voiceRecording ? '#06b6d4' : '#e5e7eb',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {voiceRecording && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
                <span style={{ color: '#374151', fontSize: '0.875rem' }}>
                  Voice Recording: Enabled
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: videoRecording ? '#06b6d4' : '#e5e7eb',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {videoRecording && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Video Recording: Optional
                </span>
              </div>
            </div>
          </div>

          {/* Usage Info */}
          {usageInfo && usageInfo.remaining !== -1 && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: usageInfo.remaining > 0 ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${usageInfo.remaining > 0 ? '#86efac' : '#fca5a5'}`,
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '0.875rem',
                color: usageInfo.remaining > 0 ? '#166534' : '#991b1b',
                fontWeight: '500'
              }}>
                {usageInfo.remaining > 0 
                  ? `${usageInfo.remaining} interview${usageInfo.remaining !== 1 ? 's' : ''} remaining this month`
                  : 'Monthly interview limit reached'}
              </span>
            </div>
          )}

          {/* Start Interview Button */}
          <button
            onClick={handleStartInterview}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              backgroundColor: '#00bfa6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#00a38d'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00bfa6'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Start Interview
          </button>
        </div>
      </div>

      {/* Limit Reached Modal */}
      {showLimitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Monthly Limit Reached
            </h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem',
              lineHeight: '1.5'
            }}>
              You've used all {usageInfo?.limit} interviews for this month. Upgrade to Premium or Professional for unlimited interviews!
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => router.push('/pricing')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="display: flex"][style*="height: 100vh"] {
            flex-direction: column !important;
          }
          
          div[style*="flex: 0 0 400px"] {
            flex: none !important;
            padding: 1rem !important;
          }
          
          div[style*="flex: 1"] {
            padding: 1rem !important;
          }
        }
        
        @media (max-width: 768px) {
          div[style*="flex: 0 0 400px"] {
            display: none !important;
          }
          
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}