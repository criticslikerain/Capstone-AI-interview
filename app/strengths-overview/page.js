'use client'
import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { ChevronRight, Lightbulb, BarChart3 } from 'lucide-react'

export default function StrengthsOverview() {
  const [expandedCard, setExpandedCard] = useState(null)

  const strengthData = {
    keyStrength: {
      name: "Clear Communication",
      identifiedIn: "3 out of 4 interviews",
      questions: [
        "Tell me about a time you resolved a conflict in the team.",
        "How would you approach solving a complex customer issue?",
        "Describe how you communicate complex ideas to non-technical people."
      ],
      categories: {
        behavioral: 60,
        problemSolving: 30,
        situational: 10
      }
    }
  }

  const questionCategories = [
    {
      id: 'behavioral',
      title: 'Behavioral Questions',
      color: '#8B5CF6'
    },
    {
      id: 'problemSolving',
      title: 'Problem-Solving Questions', 
      color: '#F59E0B'
    },
    {
      id: 'situational',
      title: 'Situational Questions',
      color: '#10B981'
    }
  ]

  const resources = [
    {
      title: "Communication Skills Workshop",
      image: "/assets/images/clearcommunication.PNG",
      description: "Enhance your verbal and written communication abilities"
    },
    {
      title: "Leadership Development Program", 
      image: "/assets/images/candidate.PNG",
      description: "Build confidence in leading teams and projects"
    },
    {
      title: "Interview Confidence Building",
      image: "/assets/images/job_interview.png", 
      description: "Master the art of presenting your strengths effectively"
    }
  ]

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      <Sidebar activeItem="strengths-overview" />

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
                  src="/assets/images/job_interview.png"
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
                  Strengths Overview
                </h1>

                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Discover which types of questions highlight your strengths the most. Use this insight to focus your preparation and continue excelling in key areas.
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
            {/* Key Strengths Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '1rem' 
              }}>
                <Lightbulb size={24} color="#F59E0B" />
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Key Strengths and their Origins
                </h2>
              </div>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
              }}>
                Discover your core strengths and understand where they shine the most. See how each strength has been consistently identified across various interview scenarios.
              </p>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '2px solid #3B82F6'
              }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {/* Left Card - Strength Info */}
                  <div style={{
                    backgroundColor: '#EFF6FF',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    flex: '0 0 200px',
                    textAlign: 'center',
                    border: '2px solid #3B82F6'
                  }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      margin: '0 auto 0.5rem auto'
                    }}>
                      <img 
                        src="/assets/images/clearcommunication.PNG" 
                        alt="Clear Communication"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <h3 style={{
                      color: '#3B82F6',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Clear Communication
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      Identified in {strengthData.keyStrength.identifiedIn}
                    </p>
                  </div>

                  {/* Right Card - Questions */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      backgroundColor: '#F0F9FF',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <BarChart3 size={20} color="#0EA5E9" />
                        <h4 style={{
                          color: '#0EA5E9',
                          fontSize: '1rem',
                          fontWeight: '600',
                          margin: 0
                        }}>
                          Questions Where This Strength Was Highlighted
                        </h4>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151' }}>
                        {strengthData.keyStrength.questions.map((question, index) => (
                          <li key={index} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Categories Chart */}
                    <div style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '8px',
                      padding: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <BarChart3 size={20} color="#0EA5E9" />
                        <h4 style={{
                          color: '#0EA5E9',
                          fontSize: '1rem',
                          fontWeight: '600',
                          margin: 0
                        }}>
                          Main Question Categories Contributing to this Strength
                        </h4>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <div style={{
                          backgroundColor: '#3B82F6',
                          height: '8px',
                          width: `${strengthData.keyStrength.categories.behavioral}%`
                        }}></div>
                        <div style={{
                          backgroundColor: '#F59E0B',
                          height: '8px',
                          width: `${strengthData.keyStrength.categories.problemSolving}%`
                        }}></div>
                        <div style={{
                          backgroundColor: '#10B981',
                          height: '8px',
                          width: `${strengthData.keyStrength.categories.situational}%`
                        }}></div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '2px' }}></div>
                          <span style={{ color: '#374151' }}>Behavioral {strengthData.keyStrength.categories.behavioral}%</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '12px', height: '12px', backgroundColor: '#F59E0B', borderRadius: '2px' }}></div>
                          <span style={{ color: '#374151' }}>Problem-Solving {strengthData.keyStrength.categories.problemSolving}%</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '2px' }}></div>
                          <span style={{ color: '#374151' }}>Situational {strengthData.keyStrength.categories.situational}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strength by Question Category */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '1rem' 
              }}>
                <Lightbulb size={24} color="#F59E0B" />
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Strength by Question Category
                </h2>
              </div>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
              }}>
                Tap on each card to reveal detailed insights about how this strength was demonstrated across different question categories.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {questionCategories.map((category) => {
                  return (
                    <div
                      key={category.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid #e5e7eb'
                      }}
                      onClick={() => setExpandedCard(expandedCard === category.id ? null : category.id)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '64px',
                            height: '64px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}>
                            {category.id === 'behavioral' && (
                              <img 
                                src="/assets/images/behavior.PNG" 
                                alt="Behavioral Questions"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            )}
                            {category.id === 'problemSolving' && (
                              <img 
                                src="/assets/images/problem.PNG" 
                                alt="Problem-Solving Questions"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            )}
                            {category.id === 'situational' && (
                              <img 
                                src="/assets/images/situational.PNG" 
                                alt="Situational Questions"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            )}
                          </div>
                          <h3 style={{
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            margin: 0,
                            color: '#1f2937'
                          }}>
                            {category.title}
                          </h3>
                        </div>
                        <ChevronRight 
                          size={24} 
                          color="#6b7280"
                          style={{
                            transform: expandedCard === category.id ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </div>
                      
                      {expandedCard === category.id && (
                        <div style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px'
                        }}>
                          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>
                            Detailed insights about your performance in {category.title.toLowerCase()} will be displayed here. 
                            This includes specific examples, scoring patterns, and recommendations for continued improvement.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Enhancement Resources */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '1rem' 
              }}>
                <div>
                  <img 
                    src="/assets/images/candidate.PNG" 
                    alt="Candidate Resources"
                    style={{
                      width: '32px',
                      height: '32px',
                      marginRight: '0.5rem',
                      verticalAlign: 'middle'
                    }}
                  />
                </div>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  margin: 0,
                  color: '#1f2937',
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}>
                  Candidate Strength Enhancement Resources
                </h2>
              </div>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
              }}>
                Access curated videos and learning materials designed to help candidates improve their strengths and refine their interview skills.
              </p>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {resource.title === "Communication Skills Workshop" ? (
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe 
                          src="https://www.youtube.com/embed/onldWh9n8e4?si=2N1gx1xlV2uuQxDw&start=6" 
                          title="YouTube video player" 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerpolicy="strict-origin-when-cross-origin" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : resource.title === "Leadership Development Program" ? (
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe 
                          src="https://www.youtube.com/embed/6L9t12Aw4O4?si=p7QeuhDqX9DV12PZ&start=15" 
                          title="YouTube video player" 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerpolicy="strict-origin-when-cross-origin" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : resource.title === "Interview Confidence Building" ? (
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe 
                          src="https://www.youtube.com/embed/gCJsGsZ3hhU?si=PvpQwUzmaYDq8w6R&start=55" 
                          title="YouTube video player" 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerpolicy="strict-origin-when-cross-origin" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div style={{
                        height: '240px',
                        backgroundColor: '#f3f4f6',
                        backgroundImage: `url(${resource.image})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {/* Use actual image instead of placeholder */}
                        <img 
                          src="/assets/images/candidate.PNG" 
                          alt="Candidate Resource"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    )}
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        margin: '0 0 0.5rem 0',
                        color: '#1f2937'
                      }}>
                        {resource.title}
                      </h3>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {resource.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}