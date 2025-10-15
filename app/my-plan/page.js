'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'

export default function MyPlan() {
  const router = useRouter()

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <Sidebar activeItem="subscriptions" />

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
              <div style={{
                flexShrink: 0
              }}>
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                  <rect x="20" y="15" width="50" height="70" rx="4" fill="white" opacity="0.9" />
                  <rect x="25" y="20" width="40" height="3" rx="1.5" fill="#06b6d4" />
                  <rect x="25" y="28" width="30" height="2" rx="1" fill="#94a3b8" />
                  <rect x="25" y="33" width="35" height="2" rx="1" fill="#94a3b8" />
                  <rect x="25" y="38" width="25" height="2" rx="1" fill="#94a3b8" />

                  <circle cx="65" cy="25" r="12" fill="#fbbf24" />
                  <text x="65" y="31" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>

                  <rect x="15" y="45" width="25" height="20" rx="2" fill="#8b5cf6" opacity="0.8" />
                  <line x1="18" y1="50" x2="37" y2="50" stroke="white" strokeWidth="1" />
                  <line x1="18" y1="55" x2="37" y2="55" stroke="white" strokeWidth="1" />
                  <line x1="18" y1="60" x2="37" y2="60" stroke="white" strokeWidth="1" />
                  <line x1="22" y1="47" x2="22" y2="63" stroke="white" strokeWidth="1" />
                  <line x1="27" y1="47" x2="27" y2="63" stroke="white" strokeWidth="1" />
                  <line x1="32" y1="47" x2="32" y2="63" stroke="white" strokeWidth="1" />
                </svg>
              </div>

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
            marginTop: '-1.5rem',
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
  )
}