'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, ChevronDown
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../contexts/AuthContext'
import { getUserSubscription, createUserSubscription, updateUserSubscription } from '../../lib/firebase'

export default function MyPlan() {
  const router = useRouter()
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedNewPlan, setSelectedNewPlan] = useState(null)
  const [processingPlan, setProcessingPlan] = useState(null)

  useEffect(() => {
    if (user) {
      loadSubscription()
      checkSelectedPlan()
    }
  }, [user])

  const loadSubscription = async () => {
    try {
      const sub = await getUserSubscription(user.uid)
      if (sub) {
        setSubscription(sub)
      } else {
        // Set default free plan if no subscription exists
        const defaultSub = {
          plan: 'free',
          price: 0,
          period: 'free',
          status: 'active',
          nextBillingDate: null,
          paymentMethod: null
        }
        await createUserSubscription(user.uid, defaultSub)
        setSubscription(defaultSub)
      }
    } catch (error) {
      console.error('Error loading subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkSelectedPlan = async () => {
    // This is now handled by payment verification
    // Remove any old localStorage data
    localStorage.removeItem('selectedPlan')
  }

  const getPlanName = () => {
    if (!subscription) return 'Loading...'
    if (subscription.plan === 'free') return 'Community Plan (Free)'
    if (subscription.plan === 'premium') return 'Premium Monthly'
    if (subscription.plan === 'professional') return 'Professional Yearly'
    return 'Unknown Plan'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const plans = [
    { id: 'free', name: 'Community Plan (Free)', price: 0, period: 'free' },
    { id: 'premium', name: 'Premium Monthly', price: 399, period: 'monthly' },
    { id: 'professional', name: 'Professional Yearly', price: 3830, period: 'yearly' }
  ]

  const handlePlanSelect = (plan) => {
    setSelectedNewPlan(plan)
    setShowDropdown(false)
    setShowConfirmModal(true)
  }

  const confirmPlanChange = async () => {
    if (!selectedNewPlan || !user) return
    
    // If changing to free plan, just update directly
    if (selectedNewPlan.id === 'free') {
      try {
        const subscriptionData = {
          plan: 'free',
          price: 0,
          period: 'free',
          status: 'active',
          nextBillingDate: null,
          paymentMethod: null
        }
        
        await updateUserSubscription(user.uid, subscriptionData)
        setSubscription(subscriptionData)
        setShowConfirmModal(false)
        setSelectedNewPlan(null)
      } catch (error) {
        console.error('Error updating subscription:', error)
        alert('Failed to update subscription. Please try again.')
      }
      return
    }

    // For paid plans, redirect to payment
    setShowConfirmModal(false)
    setProcessingPlan(selectedNewPlan.id)

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: selectedNewPlan.price,
          description: `InterviewPro ${selectedNewPlan.period === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
          plan: selectedNewPlan.id,
          period: selectedNewPlan.period,
          userId: user.uid
        })
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to process payment. Please try again.')
      setProcessingPlan(null)
      setSelectedNewPlan(null)
    }
  }

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
            paddingTop: '1.25rem',
            paddingBottom: '1.5rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '800px',
              margin: '0 auto',
              padding: '0 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem'
            }}>
              <div style={{
                flexShrink: 0
              }}>
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
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
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  margin: 0,
                  marginBottom: '0.375rem'
                }}>
                  My Plan
                </h1>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.4'
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
            padding: '1.25rem',
            marginTop: '-1rem',
            position: 'relative',
            zIndex: 3
          }}>
            {/* Current Subscription Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151',
                margin: 0,
                marginBottom: '1rem'
              }}>
                Current Subscription
              </h2>

              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#06b6d4'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#fbbf24',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '32px',
                      height: '14px',
                      backgroundColor: '#ef4444',
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '7px', color: 'white', fontWeight: 'bold' }}>✓</span>
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      marginBottom: '0.25rem'
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#06b6d4',
                        margin: 0
                      }}>
                        {loading ? 'Loading...' : getPlanName()}
                      </h3>
                      {subscription && (
                        <span style={{
                          padding: '0.125rem 0.625rem',
                          backgroundColor: subscription.status === 'active' ? '#10b981' : subscription.status === 'pending' ? '#f59e0b' : '#ef4444',
                          color: 'white',
                          borderRadius: '10px',
                          fontSize: '0.6875rem',
                          fontWeight: '600'
                        }}>
                          {subscription.status === 'active' ? 'Active' : subscription.status === 'pending' ? 'Pending' : 'Inactive'}
                        </span>
                      )}
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.8125rem',
                      margin: 0
                    }}>
                      {subscription?.plan === 'free' ? 'Free plan - No billing' : `Next billing: ${formatDate(subscription?.nextBillingDate)}`}
                    </p>
                  </div>

                  <ChevronDown 
                    size={20} 
                    style={{ 
                      color: '#6b7280',
                      transition: 'transform 0.2s',
                      transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    overflow: 'hidden'
                  }}>
                    {plans.map((plan, index) => (
                      <div
                        key={plan.id}
                        onClick={() => handlePlanSelect(plan)}
                        style={{
                          padding: '0.875rem 1rem',
                          cursor: 'pointer',
                          borderBottom: index === plans.length - 1 ? 'none' : '1px solid #f3f4f6',
                          transition: 'background-color 0.2s',
                          backgroundColor: subscription?.plan === plan.id ? '#f0f9ff' : 'white'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = subscription?.plan === plan.id ? '#f0f9ff' : 'white'}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{
                              fontSize: '0.9375rem',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '0.125rem'
                            }}>
                              {plan.name}
                            </div>
                            <div style={{
                              fontSize: '0.8125rem',
                              color: '#6b7280'
                            }}>
                              {plan.price === 0 ? 'Free' : `₱${plan.price}/${plan.period === 'monthly' ? 'month' : 'year'}`}
                            </div>
                          </div>
                          {subscription?.plan === plan.id && (
                            <span style={{
                              padding: '0.125rem 0.5rem',
                              backgroundColor: '#06b6d4',
                              color: 'white',
                              borderRadius: '8px',
                              fontSize: '0.6875rem',
                              fontWeight: '600'
                            }}>
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* More Information Link inside dropdown */}
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#f8fafc',
                        borderTop: '1px solid #e2e8f0',
                        textAlign: 'center'
                      }}
                    >
                      <a
                        href="/pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.8125rem',
                          color: '#06b6d4',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#0891b2'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#06b6d4'}
                      >
                        For more information, click here
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Section - Only show for paid plans */}
            {subscription && subscription.plan !== 'free' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '1rem'
                }}>
                  Payment Method
                </h2>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e5e7eb',
                      flexShrink: 0
                    }}>
                      <img
                        src="https://images.seeklogo.com/logo-png/38/1/gcash-logo-png_seeklogo-383190.png"
                        alt="GCash Logo"
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'contain'
                        }}
                      />
                    </div>

                    <div>
                      <h3 style={{
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        color: '#374151',
                        margin: 0,
                        marginBottom: '0.125rem'
                      }}>
                        GCash
                      </h3>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.8125rem',
                        margin: 0
                      }}>
                        Payment via GCash
                      </p>
                    </div>
                  </div>

                  <span style={{
                    padding: '0.375rem 1.125rem',
                    backgroundColor: '#f0f9ff',
                    color: '#06b6d4',
                    border: '1px solid #bae6fd',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: '600'
                  }}>
                    GCash Only
                  </span>
                </div>
              </div>
            )}

            {/* Billing History Section - Only show for paid plans */}
            {subscription && subscription.plan !== 'free' && subscription.lastPaymentDate && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <h2 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0
                  }}>
                    Billing History
                  </h2>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#06b6d4',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
                      {new Date(subscription.lastPaymentDate).getDate()}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      marginBottom: '0.125rem'
                    }}>
                      <h3 style={{
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        color: '#06b6d4',
                        margin: 0
                      }}>
                        {formatDate(subscription.lastPaymentDate)}
                      </h3>
                      <span style={{
                        padding: '0.125rem 0.625rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        borderRadius: '10px',
                        fontSize: '0.6875rem',
                        fontWeight: '600'
                      }}>
                        Paid
                      </span>
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.8125rem',
                      margin: 0
                    }}>
                      PHP {subscription.price}.00 via GCash
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <button 
                onClick={() => {
                  setShowDropdown(true)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                disabled={processingPlan !== null}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: processingPlan ? 'not-allowed' : 'pointer',
                  opacity: processingPlan ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}>
                {processingPlan ? 'Processing...' : 'Change Plan'}
              </button>

              {subscription && subscription.plan !== 'free' && (
                <button style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => {
                  if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
                    confirmPlanChange()
                  }
                }}>
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedNewPlan && (
        <div 
          onClick={() => setShowConfirmModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                Change Subscription Plan?
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Are you sure you want to change your subscription to <strong>{selectedNewPlan.name}</strong>?
                {selectedNewPlan.price > 0 ? (
                  <span>
                    <br /><br />
                    You will be charged <strong>₱{selectedNewPlan.price}</strong> {selectedNewPlan.period === 'monthly' ? 'monthly' : 'annually'} via <strong>GCash</strong>.
                    <br /><br />
                    You'll be redirected to PayMongo to complete your payment securely.
                  </span>
                ) : (
                  <span>
                    <br /><br />
                    You will be downgraded to the free plan and lose access to premium features.
                  </span>
                )}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  setSelectedNewPlan(null)
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmPlanChange}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}