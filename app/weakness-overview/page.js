'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Lightbulb,
  Target,
  Calendar,
  HelpCircle
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'

export default function WeaknessOverview() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('Problem-solving')

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
  ]

  const improvementCategories = [
    { id: 'behavioral', label: 'Behavioral', active: false },
    { id: 'problem-solving', label: 'Problem-solving', active: true },
    { id: 'situational', label: 'Situational', active: false }
  ]

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <Sidebar activeItem="weakness-overview" />

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
            paddingBottom: '3rem',
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
                  src="/assets/images/weakness_overview.png"
                  alt="Job interview"
                  style={{
                    width: '160px',
                    height: '160px',
                    objectFit: 'contain',
                    transform: 'scale(1.5)',
                    transformOrigin: 'center'
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

          {/* Content Area */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            position: 'relative'
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
  )
}