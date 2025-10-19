'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home,
  Clock,
  Zap,
  HelpCircle,
  CreditCard,
  User,
  Settings,
  Mail,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ChatBubbleLogo from '../../components/ChatBubbleLogo'
import { getInterviewSessions, getUserSubscription } from '../../lib/firebase'

export default function ProfilePage() {
  const router = useRouter()
  const { user, userProfile, getInitials, getFullName, logout, loading, refreshUserProfile } = useAuth()
  const [localUserProfile, setLocalUserProfile] = useState(null)
  const [userId, setUserId] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [interviewStats, setInterviewStats] = useState({
    totalInterviews: 0,
    bestRating: 0,
    averageRating: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [subscription, setSubscription] = useState({ plan: 'free', status: 'active' })
  
  const currentProfile = userProfile || localUserProfile

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]
      
      // If no Firebase user and no JWT token, redirect to login
      if (!user && !token) {
        router.push('/login')
        return
      }
      
      // If we have Firebase user, use Firebase data
      if (user && userProfile) {
        setUserId(user.uid)
        setFormData({
          firstName: userProfile.first_name || '',
          lastName: userProfile.last_name || '',
          email: userProfile.email || user.email || '',
          phoneNumber: userProfile.phone_number || '',
          address: userProfile.address || ''
        })
        // Fetch interview stats and subscription
        fetchInterviewStats(user.uid)
        fetchSubscription(user.uid)
      }
      // If we have JWT token but no Firebase user, fetch from API
      else if (token && !user) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await res.json()
          if (data.user) {
            setLocalUserProfile(data.user)
            setUserId(data.user.id)
            setFormData({
              firstName: data.user.first_name || '',
              lastName: data.user.last_name || '',
              email: data.user.email || '',
              phoneNumber: data.user.phone_number || '',
              address: data.user.address || ''
            })
            // Fetch interview stats and subscription
            fetchInterviewStats(data.user.id)
            fetchSubscription(data.user.id)
          }
        } catch (err) {
          console.error('Error fetching user:', err)
        }
      }
    }
    
    checkAuth()
  }, [user, userProfile, router])

  const fetchSubscription = async (uid) => {
    try {
      const sub = await getUserSubscription(uid)
      setSubscription(sub)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const fetchInterviewStats = async (uid) => {
    try {
      setLoadingStats(true)
      const sessions = await getInterviewSessions(uid)
      
      if (sessions.length === 0) {
        setInterviewStats({
          totalInterviews: 0,
          bestRating: 0,
          averageRating: 0
        })
      } else {
        // Calculate stats
        const totalInterviews = sessions.length
        const scores = sessions.map(s => s.percentage_scored || 0)
        const bestRating = Math.max(...scores)
        const averageRating = scores.reduce((a, b) => a + b, 0) / scores.length
        
        setInterviewStats({
          totalInterviews,
          bestRating: Math.round(bestRating * 10) / 10, // Round to 1 decimal
          averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal
        })
      }
    } catch (error) {
      console.error('Error fetching interview stats:', error)
      setInterviewStats({
        totalInterviews: 0,
        bestRating: 0,
        averageRating: 0
      })
    } finally {
      setLoadingStats(false)
    }
  }

  const handleNavigation = (itemId) => {
    switch (itemId) {
      case 'dashboard':
        router.push('/user-dashboard')
        break
      case 'live-interview':
        router.push('/live-ai-interview-content-page')
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setMessage('')
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]
      
      if (!userId) {
        setMessage('User ID not found. Please try logging in again.')
        setSaving(false)
        return
      }
      
      const res = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          address: formData.address
        })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMessage('Profile updated successfully!')
        // Update local state
        if (localUserProfile) {
          setLocalUserProfile({
            ...localUserProfile,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phoneNumber,
            address: formData.address
          })
        }
        // Refresh Firebase user profile
        if (refreshUserProfile) {
          await refreshUserProfile()
        }
      } else {
        setMessage(data.error || 'Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #06b6d4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading profile...</p>
        </div>
      </div>
    )
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
              const isActive = item.id === 'profile'

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

          {/* Logout Button */}
          <div style={{ padding: '1rem' }}>
            <button
              onClick={async () => {
                await logout()
                router.push('/login')
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#b91c1c'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#dc2626'
              }}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
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
            paddingTop: '1rem',
            paddingBottom: '1rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '800px',
              margin: '0 auto',
              padding: '0 2rem'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {getInitials()}
              </div>

              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                {getFullName()}
              </h1>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Mail size={16} />
                  <span style={{
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    {currentProfile?.email || user?.email || 'No email'}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: subscription.plan === 'free' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                  borderRadius: '20px',
                  border: `1px solid ${subscription.plan === 'free' ? '#22d3ee' : '#fbbf24'}`
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    Current Plan: {subscription.plan === 'free' ? 'Free' : subscription.plan === 'premium' ? 'Premium Monthly' : 'Professional Yearly'}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '2rem',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    {loadingStats ? '...' : interviewStats.totalInterviews}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    Total Interviews Taken
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    {loadingStats ? '...' : interviewStats.bestRating}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    Best Interview Rating
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    {loadingStats ? '...' : interviewStats.averageRating}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    Average Interview Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem',
            marginTop: '2rem',
            position: 'relative',
            zIndex: 3
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
              </div>

              {message && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: message.includes('successfully') ? '#d1fae5' : '#fee2e2',
                  border: `1px solid ${message.includes('successfully') ? '#86efac' : '#fca5a5'}`,
                  color: message.includes('successfully') ? '#059669' : '#dc2626',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  {message}
                </div>
              )}

              <div style={{ marginTop: '2rem' }}>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '1rem 2rem',
                    backgroundColor: saving ? '#9ca3af' : '#06b6d4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  {saving ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}