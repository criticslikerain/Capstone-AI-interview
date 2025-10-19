'use client'
import React from 'react'
import { Info, Mail, Globe, Shield, Award, Users } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

export default function AppInfoPage() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      <Sidebar activeItem="app-info" />

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
            paddingTop: '2rem',
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
              <div style={{ flexShrink: 0 }}>
                <Info size={120} color="white" strokeWidth={1.5} />
              </div>

              <div style={{ textAlign: 'left' }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  marginBottom: '0.75rem'
                }}>
                  App Information
                </h1>

                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Learn more about InterviewPro, our mission, and how we help you ace your interviews.
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2rem',
            marginTop: '2rem'
          }}>
            {/* About Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#06b6d4',
                margin: 0,
                marginBottom: '1rem'
              }}>
                About InterviewPro
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#374151',
                lineHeight: '1.8',
                margin: 0
              }}>
                InterviewPro is an AI-powered interview preparation platform designed to help job seekers practice and perfect their interview skills. 
                Using advanced speech recognition and natural language processing, our platform simulates realistic interview scenarios, 
                provides instant feedback, and tracks your progress over time. Whether you're preparing for your first job interview or 
                looking to sharpen your skills for a career change, InterviewPro is your personal interview coach available 24/7.
              </p>
            </div>

            {/* Features Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#06b6d4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Award size={24} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  AI-Powered Feedback
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Get instant, detailed feedback on your responses with actionable insights to improve your performance.
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#06b6d4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Users size={24} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  Realistic Simulations
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Practice with AI interviewers that simulate real interview scenarios across various industries.
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#06b6d4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Shield size={24} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  Secure & Private
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Your data is encrypted and secure. We never share your personal information with third parties.
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#06b6d4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Globe size={24} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  Available Anywhere
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Practice on any device, anytime, anywhere. Our platform is fully responsive and mobile-friendly.
                </p>
              </div>
            </div>

            {/* App Details */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#06b6d4',
                margin: 0,
                marginBottom: '1.5rem'
              }}>
                App Details
              </h2>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span style={{ color: '#6b7280', fontWeight: '500' }}>Version</span>
                  <span style={{ color: '#374151', fontWeight: '600' }}>1.0.0</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span style={{ color: '#6b7280', fontWeight: '500' }}>Last Updated</span>
                  <span style={{ color: '#374151', fontWeight: '600' }}>October 2025</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span style={{ color: '#6b7280', fontWeight: '500' }}>Developer</span>
                  <span style={{ color: '#374151', fontWeight: '600' }}>InterviewPro Team</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0'
                }}>
                  <span style={{ color: '#6b7280', fontWeight: '500' }}>License</span>
                  <span style={{ color: '#374151', fontWeight: '600' }}>Proprietary</span>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#06b6d4',
                margin: 0,
                marginBottom: '1.5rem'
              }}>
                Get in Touch
              </h2>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#06b6d4',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Mail size={20} color="white" />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: 0,
                      marginBottom: '0.25rem'
                    }}>
                      Email Support
                    </p>
                    <a
                      href="mailto:ai.interview.capstone@gmail.com"
                      style={{
                        fontSize: '1rem',
                        color: '#06b6d4',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                    >
                      ai.interview.capstone@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#06b6d4',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Globe size={20} color="white" />
                  </div>
                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: 0,
                      marginBottom: '0.25rem'
                    }}>
                      Website
                    </p>
                    <a
                      href="https://www.interviewpro.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '1rem',
                        color: '#06b6d4',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                    >
                      www.interviewpro.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
