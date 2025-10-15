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
  LogOut,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useAuth } from '../app/contexts/AuthContext'
import ChatBubbleLogo from './ChatBubbleLogo'

export default function Sidebar({ activeItem }) {
  const router = useRouter()
  const { logout } = useAuth()
  const isSubItemActive = activeItem === 'strengths-overview' || activeItem === 'weakness-overview'
  const [isPastInterviewsExpanded, setIsPastInterviewsExpanded] = useState(isSubItemActive)

  useEffect(() => {
    if (isSubItemActive) {
      setIsPastInterviewsExpanded(true)
    }
  }, [isSubItemActive])

  const handleNavigation = (itemId) => {
    switch(itemId) {
      case 'dashboard':
        router.push('/user-dashboard')
        break
      case 'live-interview':
        router.push('/live-ai-interview-content-page')
        break
      case 'past-interviews':
        setIsPastInterviewsExpanded(!isPastInterviewsExpanded)
        break
      case 'strengths-overview':
        router.push('/strengths-overview')
        break
      case 'weakness-overview':
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

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
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

  return (
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
      {/* Dark overlay for sidebar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        zIndex: 1
      }}></div>
      
      {/* Sidebar content wrapper */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Logo Section */}
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

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeItem
            const isPastInterviews = item.id === 'past-interviews'
            const isSubItemActive = activeItem === 'strengths-overview' || activeItem === 'weakness-overview'
            
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: (isActive || (isPastInterviews && isSubItemActive)) ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                    color: 'white',
                    border: 'none',
                    borderLeft: (isActive || (isPastInterviews && isSubItemActive)) ? '4px solid #06b6d4' : '4px solid transparent',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive && !(isPastInterviews && isSubItemActive)) {
                      e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.7)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive && !(isPastInterviews && isSubItemActive)) {
                      e.target.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                  {isPastInterviews && (
                    <div style={{ marginLeft: 'auto' }}>
                      {isPastInterviewsExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                  )}
                </button>
                
                {/* Dropdown for Past Interviews */}
                {isPastInterviews && isPastInterviewsExpanded && (
                  <div style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderLeft: '4px solid transparent'
                  }}>
                    <button
                      onClick={() => handleNavigation('strengths-overview')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1.5rem 0.75rem 3rem',
                        backgroundColor: activeItem === 'strengths-overview' ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                        color: 'white',
                        border: 'none',
                        borderLeft: activeItem === 'strengths-overview' ? '4px solid #06b6d4' : '4px solid transparent',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (activeItem !== 'strengths-overview') {
                          e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (activeItem !== 'strengths-overview') {
                          e.target.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      <TrendingUp size={18} />
                      Strengths Overview
                    </button>
                    
                    <button
                      onClick={() => handleNavigation('weakness-overview')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1.5rem 0.75rem 3rem',
                        backgroundColor: activeItem === 'weakness-overview' ? 'rgba(6, 182, 212, 0.3)' : 'transparent',
                        color: 'white',
                        border: 'none',
                        borderLeft: activeItem === 'weakness-overview' ? '4px solid #06b6d4' : '4px solid transparent',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (activeItem !== 'weakness-overview') {
                          e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (activeItem !== 'weakness-overview') {
                          e.target.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      <TrendingDown size={18} />
                      Weakness Overview
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '1rem' }}>
          <button
            onClick={handleLogout}
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
  )
}