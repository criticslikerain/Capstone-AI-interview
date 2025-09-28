'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home,
  User,
  Users,
  CreditCard,
  HeadphonesIcon,
  Bug,
  LogOut,
  Mail,
  Phone,
  UserIcon
} from 'lucide-react'
import ChatBubbleLogo from '../../components/ChatBubbleLogo'

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('profile')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleNavigation = (itemId) => {
    switch (itemId) {
      case 'dashboard':
        setActiveSection('dashboard')
        break
      case 'profile':
        setActiveSection('profile')
        break
      case 'management':
        setActiveSection('management')
        break
      case 'subscriptions':
        setActiveSection('subscriptions')
        break
      case 'support':
        setActiveSection('support')
        break
      case 'issues':
        setActiveSection('issues')
        break
      default:
        break
    }
  }

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'Admin Profile' },
    { id: 'management', icon: Users, label: 'Admin Management' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'support', icon: HeadphonesIcon, label: 'Member Support' },
    { id: 'issues', icon: Bug, label: 'Issue Tracker' }
  ]

  const [userProfile, setUserProfile] = useState({
    name: 'David Michael Osia',
    email: 'davidmichaelosia@mailagent.com',
    phone: 'not specified',
    address: 'not specified',
    status: 'Away'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [subscriptionSearchTerm, setSubscriptionSearchTerm] = useState('')
  const [responseText, setResponseText] = useState('')
  const [admins] = useState([
    {
      id: 1,
      name: 'Zagado Kyle',
      role: 'Admin',
      lastLogin: '2100, June 04, 2025',
      avatar: 'https://scontent.fceb2-2.fna.fbcdn.net/v/t39.30808-6/471167535_1241413147090540_5931458370259197396_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEfsNSC-hzKbPfw5BNNgBCVtoIZLhbBUOq2ghkuFsFQ6q-Qn5wJuDTug1sg0-WeiZpH5Wtqr0DXuPnjW_aWqD0d&_nc_ohc=YBIzxdQcJrgQ7kNvwHX29lu&_nc_oc=Admn948tPB1GORZiKZCQU2wnOWKT6bO7IjUm5hGaU0asK1PMl72EvQpwtWP1UKeY-M0&_nc_zt=23&_nc_ht=scontent.fceb2-2.fna&_nc_gid=Ly0uRjd3daUPyQeHPpq8oA&oh=00_AfVPJLcIXgeTVHyCYDSeAgvN9uy9CRLwmH-dmR5STJnwoA&oe=689D40F7'
    },
    {
      id: 2,
      name: 'David Michael Osia',
      role: 'Admin',
      lastLogin: '1700, May 20, 2025',
      avatar: 'https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-6/332894731_871500290627490_9114427192078729508_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEIQK4MFgnnRT9WfUg2B6s136FuOVzB0ezfoW45XMHR7GLHbu64z4xh439aJE-Nbc3U3zbd5CTvoo94jdtMy3N9&_nc_ohc=NcggS-PF0-YQ7kNvwEnFr6M&_nc_oc=AdmeDZmzyHsvb6r0FV2ZRFXlM9ivTKJ6uCa92aRo5yfmBZx-PSHmFy6Cy2WeumNPo3E&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&_nc_gid=YkQdYl3LxA2evXlqFcpT-A&oh=00_AfUgs_cUtw8mcGo5D5X2VU8M7Y4nPEiFGcH52XLOnN2pUg&oe=689D38F6'
    },
    {
      id: 3,
      name: 'William James Apila Janohan',
      role: 'Admin',
      lastLogin: '0400, May 09, 2025',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 4,
      name: 'Robert Labastera Jr.',
      role: 'Admin',
      lastLogin: '1530, May 15, 2025',
      avatar: 'https://scontent.fceb2-2.fna.fbcdn.net/v/t39.30808-6/482961687_2128330637637745_2811187215323930808_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGcrObzEl5w2Lc9dQpEtOkWLGq9ZFevsqIsar1kV6-yosJbygugb9vCQUdASNjhFxcFNQdAF5xUslOeffoddQeF&_nc_ohc=2_O2P8qVpFQQ7kNvwGj0P_B&_nc_oc=Adk_oQ-DQzI8IhpzYsLyd5IStO1OSC6A48fmDF9W6z2Y5fHJqHFatWDTUvxi3EgOyEg&_nc_zt=23&_nc_ht=scontent.fceb2-2.fna&_nc_gid=ZN7YIK3aHuSd5hnmlFQ3Mg&oh=00_AfVf-7U62v3ujCA0kKF-ddsin1DorteLHYyB6Mnxh0u3ew&oe=689D686F'
    }
  ])

  const handleProfileUpdate = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div style={{
            flex: 1,
            backgroundColor: '#f9fafb',
            minHeight: '100vh'
          }}>
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
                <img
                  src="https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-6/332894731_871500290627490_9114427192078729508_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEIQK4MFgnnRT9WfUg2B6s136FuOVzB0ezfoW45XMHR7GLHbu64z4xh439aJE-Nbc3U3zbd5CTvoo94jdtMy3N9&_nc_ohc=NcggS-PF0-YQ7kNvwEnFr6M&_nc_oc=AdmeDZmzyHsvb6r0FV2ZRFXlM9ivTKJ6uCa92aRo5yfmBZx-PSHmFy6Cy2WeumNPo3E&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&_nc_gid=YkQdYl3LxA2evXlqFcpT-A&oh=00_AfUgs_cUtw8mcGo5D5X2VU8M7Y4nPEiFGcH52XLOnN2pUg&oe=689D38F6"
                  alt="David Michael Osia"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid rgba(255, 255, 255, 0.3)'
                  }}
                />
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
                    David!
                  </p>
                </div>
              </div>

              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  Dashboard
                </h2>
                <p style={{
                  color: '#6b7280',
                  fontSize: '1rem',
                  margin: 0
                }}>
                  Plan, prioritize and accomplish your task with ease.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '1.5rem'
                  }}>
                    Sales
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '1.5rem',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>This Month's Revenue</span>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem' }}>
                        10,328
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem' }}>
                        10% higher than last month
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#f3f4f6',
                      padding: '1.5rem',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Churn Rate</span>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginTop: '1rem' }}>
                        23%
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    Member Support
                  </h3>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '2rem'
                  }}>
                    <input
                      type="text"
                      placeholder="Search a ticket"
                      style={{
                        flex: 1,
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#06b6d4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}>
                      Search
                    </button>
                  </div>

                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/019/638/570/non_2x/cardboard-box-brown-free-png.png"
                      alt="Empty cardboard box"
                      style={{
                        width: '120px',
                        height: 'auto',
                        marginBottom: '1.5rem',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                      }}
                    />

                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      There are no support request at this moment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'profile':
        return (
          <div style={{
            flex: 1,
            padding: '2rem',
            backgroundColor: 'white',
            minHeight: '100vh'
          }}>
            <div style={{
              height: '200px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              marginBottom: '2rem',
              position: 'relative',
              backgroundImage: 'url("https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px'
              }}></div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginTop: '-100px',
              position: 'relative',
              zIndex: 10
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  <img
                    src="https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-6/332894731_871500290627490_9114427192078729508_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEIQK4MFgnnRT9WfUg2B6s136FuOVzB0ezfoW45XMHR7GLHbu64z4xh439aJE-Nbc3U3zbd5CTvoo94jdtMy3N9&_nc_ohc=NcggS-PF0-YQ7kNvwEnFr6M&_nc_oc=AdmeDZmzyHsvb6r0FV2ZRFXlM9ivTKJ6uCa92aRo5yfmBZx-PSHmFy6Cy2WeumNPo3E&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&_nc_gid=YkQdYl3LxA2evXlqFcpT-A&oh=00_AfUgs_cUtw8mcGo5D5X2VU8M7Y4nPEiFGcH52XLOnN2pUg&oe=689D38F6"
                    alt="David Michael Osia"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <h1 style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      margin: 0
                    }}>
                      {userProfile.name}
                    </h1>
                    <span style={{
                      backgroundColor: '#06b6d4',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      ADMIN
                    </span>
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    margin: 0
                  }}>
                    {userProfile.status}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gap: '1.5rem',
                maxWidth: '600px'
              }}>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    Update Status
                  </button>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    Update profile information
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'management':
        return (
          <div style={{
            flex: 1,
            padding: '2rem',
            backgroundColor: '#f9fafb',
            minHeight: '100vh'
          }}>
            {/* Header Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '2rem'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#f59e0b',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <UserIcon size={40} color="white" />
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#06b6d4',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white'
                    }}>
                      <Users size={12} color="white" />
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Admin Management
                  </h1>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    This page allows Super Admins to view, manage, and control Admin accounts within the InterviewPro system. It includes functionality for creating, modifying, deactivating, and assigning roles to Admin users.
                  </p>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  placeholder="Looking for something"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Search
                </button>
              </div>
            </div>

            {/* Your Admins Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Your Admins
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    View Logs
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#06b6d4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    Invite
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: 'white'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={admin.avatar}
                        alt={admin.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <div>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0,
                          marginBottom: '0.25rem'
                        }}>
                          {admin.name}
                        </h3>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {admin.role}
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        Last Login: {admin.lastLogin}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        color: '#374151',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}>
                        Edit
                      </button>
                      <button style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #f59e0b',
                        backgroundColor: 'white',
                        color: '#f59e0b',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}>
                        Deactivate
                      </button>
                      <button style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #dc2626',
                        backgroundColor: 'white',
                        color: '#dc2626',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Statistics Footer */}
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Total Admins: 
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    4
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Active: 
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#10b981'
                  }}>
                    1
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Unavailable: 
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#dc2626'
                  }}>
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      case 'subscriptions':
        return (
          <div style={{
            flex: 1,
            padding: '2rem',
            backgroundColor: '#f9fafb',
            minHeight: '100vh'
          }}>
            {/* Search Bar */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  placeholder="Looking for something..."
                  value={subscriptionSearchTerm}
                  onChange={(e) => setSubscriptionSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Search
                </button>
              </div>
            </div>

            {/* Statistics Header */}
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '2rem'
            }}>
              Statistics
            </h1>

            {/* Statistics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Active Subscriptions Card */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    Active Subscriptions
                  </h3>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer'
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </div>
                </div>

                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '2rem'
                }}>
                  There are more free trial plans than paid planned subscriptions.
                </p>

                {/* Donut Chart */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '2rem',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: `conic-gradient(#3b82f6 0deg 252deg, #e5e7eb 252deg 360deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#111827'
                    }}>
                      35.2
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      Free trials
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#e5e7eb'
                    }}></div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      Paid plans
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown Card */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    Revenue Breakdown
                  </h3>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer'
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </div>
                </div>

                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '2rem'
                }}>
                  Revenue steadily increased over the first three months, with March generating the highest revenue overall.
                </p>

                {/* Chart Area */}
                <div style={{
                  height: '200px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  padding: '1rem',
                  position: 'relative',
                  marginBottom: '1rem'
                }}>
                  {/* Y-axis labels */}
                  <div style={{
                    position: 'absolute',
                    left: '0.5rem',
                    top: '1rem',
                    bottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <span>2000</span>
                    <span>1500</span>
                    <span>1000</span>
                    <span>500</span>
                    <span>0</span>
                  </div>

                  {/* Chart line simulation */}
                  <div style={{
                    marginLeft: '2rem',
                    marginRight: '1rem',
                    height: '100%',
                    position: 'relative'
                  }}>
                    <svg style={{
                      width: '100%',
                      height: '80%',
                      position: 'absolute',
                      top: '10%'
                    }}>
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                        points="0,120 80,100 160,60 240,40"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(6, 182, 212, 0.3))'
                        }}
                      />
                      <circle cx="0" cy="120" r="4" fill="#06b6d4" />
                      <circle cx="80" cy="100" r="4" fill="#06b6d4" />
                      <circle cx="160" cy="60" r="4" fill="#06b6d4" />
                      <circle cx="240" cy="40" r="4" fill="#06b6d4" />
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    left: '2rem',
                    right: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <span>January</span>
                    <span>February</span>
                    <span>March</span>
                    <span>April</span>
                  </div>
                </div>

                {/* Revenue indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: '#06b6d4'
                  }}></div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Revenue
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem'
            }}>
              {/* Promo Codes Card */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#dc2626">
                    <path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path d="M6 6h.008v.008H6V6z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '0.25rem'
                  }}>
                    Promo codes
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Create and manage promo codes
                  </p>
                </div>
              </div>

              {/* User Subscriptions Card */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6">
                    <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '0.25rem'
                  }}>
                    User Subscriptions
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Manage user subscriptions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      case 'support':
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#e5e7eb',
      minHeight: '100vh',
      display: 'flex',
      gap: '2rem',
      padding: '2rem'
    }}>
      <div style={{
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Ticket Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Ticket Number: 12555
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              App Crash
            </span>
            <span style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              Working
            </span>
          </div>

          <div style={{
            display: 'flex',
            gap: '2rem',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '0.5rem'
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#06b6d4',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              borderBottom: '2px solid #06b6d4',
              paddingBottom: '0.5rem'
            }}>
              Email
            </button>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}>
              Notes
            </button>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}>
              Status
            </button>
          </div>
        </div>

        {/* Response Area */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <textarea
            placeholder="Write a response..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            style={{
              width: '100%',
              height: '120px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '0.875rem',
              color: '#374151',
              fontFamily: 'Inter, sans-serif'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1rem'
          }}>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Send
            </button>
          </div>
        </div>

        {/* Thread Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Thread
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#06b6d4',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              Zaga
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Zagado Kyle
                </h4>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  zagado@testing.com
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '1rem'
              }}>
                Tue, May 22, 2025 21:00
              </p>

              <div style={{
                fontSize: '0.875rem',
                color: '#374151',
                lineHeight: '1.6',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: '0 0 1rem 0' }}>
                  Dear InterviewPro Support Team,
                </p>
                <p style={{ margin: '0 0 1rem 0' }}>
                  I'm writing to report an issue I've been experiencing with the app. Every time I start a live mock interview, the app crashes within a few seconds after the first question is asked. I've tried restarting my phone and reinstalling the app, but the problem still persists.
                </p>
                <p style={{ margin: '0 0 1rem 0' }}>
                  I'm currently using an Android device (Samsung Galaxy S21, Android 13), and the crashes began after the most recent update. This is preventing me from completing my practice sessions, which is a bit frustrating as I'm preparing for a new interview next week.
                </p>
                <p style={{ margin: '0 0 1rem 0' }}>
                  Could you please look into this and let me know if there's a workaround available?
                </p>
                <p style={{ margin: '0 0 1rem 0' }}>
                  Thanks for your assistance!
                </p>
                <p style={{ margin: 0 }}>
                  Best regards,<br />
                  Zagado Kyle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Up Next */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          Up next (2)
        </h3>

        {/* Nathaniel Inocando */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#8b5cf6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              Nat
            </div>
            <div>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                margin: 0,
                marginBottom: '0.25rem'
              }}>
                Nathaniel Inocando
              </h4>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>
                nathanielinocando@aol.com
              </p>
            </div>
          </div>
          <h5 style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#111827',
            margin: 0,
            marginBottom: '0.5rem'
          }}>
            Payment Issue
          </h5>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: 0,
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            I cannot pay using GCash. Whenever I try it gives thus error messa...
          </p>
          <button style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            color: '#374151',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            width: '100%'
          }}>
            View
          </button>
        </div>

        {/* Ringgal Campanilla */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#f59e0b',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              Rin
            </div>
            <div>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                margin: 0,
                marginBottom: '0.25rem'
              }}>
                Ringgal Campanilla
              </h4>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>
                ringgal@testing.com
              </p>
            </div>
          </div>
          <h5 style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#111827',
            margin: 0,
            marginBottom: '0.5rem'
          }}>
            App is crashing
          </h5>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: 0,
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            It's very frustrating that everytime I click the microph...
          </p>
          <button style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            color: '#374151',
            borderRadius: '6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            width: '100%'
          }}>
            View
          </button>
        </div>
      </div>
    </div>
  )
      case 'issues':
  return (
    <div style={{
      flex: 1,
      padding: '2rem',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      {/* Clustered User Feedback (Bug Reports) */}
      <div style={{
        backgroundColor: '#e5e7eb',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1.5rem'
        }}>
          Clustered User Feedback (Bug Reports)
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#374151',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              About 20 users reported issues with Card payments.
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              Clustered on 2nd of June 2025, 21:00
            </p>
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              <button style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}>
                View
              </button>
              <button style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}>
                Assign
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#374151',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              2 users reported experiencing an app crash when pressing microphone but...
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              Clustered on 2nd of June 2025, 21:00
            </p>
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              <button style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}>
                View
              </button>
              <button style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}>
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Resolution Progress */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '2rem'
        }}>
          Issue Resolution Progress
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '1.5rem'
        }}>
          {/* Backlog Column */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Backlog
              </h3>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              textAlign: 'center',
              margin: '2rem 0',
              fontStyle: 'italic'
            }}>
              There are no backlogs at this moment.
            </p>
          </div>

          {/* To do Column */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                To do
              </h3>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              textAlign: 'center',
              margin: '2rem 0',
              fontStyle: 'italic'
            }}>
              There are no To do at this moment.
            </p>
          </div>

          {/* In Progress Column */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
              </svg>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                In Progress
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                Payment Issue with GCash
              </div>
              <div style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                Interview Simulation Bug
              </div>
            </div>
          </div>

          {/* Testing Column */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#8b5cf6">
                <path d="M19.07,4.93C17.22,3 14.66,1.96 12,2C9.34,1.96 6.79,3 4.94,4.93C3,6.78 1.96,9.34 2,12C1.96,14.66 3,17.21 4.93,19.06C6.78,21 9.34,22.04 12,22C14.66,22.04 17.21,21 19.06,19.07C21,17.22 22.04,14.66 22,12C22.04,9.34 21,6.78 19.07,4.93M17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12Z" />
              </svg>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Testing
              </h3>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              textAlign: 'center',
              margin: '2rem 0',
              fontStyle: 'italic'
            }}>
              There are no testing at this moment.
            </p>
          </div>
        </div>
      </div>

      {/* Work In Progress Task */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Work In Progress Task
          </h2>
          <button style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            color: '#374151',
            borderRadius: '6px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            + Add Admin
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Zagado Kyle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#06b6d4',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                Zago
              </div>
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  Zagado Kyle
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Working on Payment Issue with GCash
                </p>
              </div>
            </div>
            <span style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              In Progress
            </span>
          </div>

          {/* David Michael Osia */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#10b981',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                David
              </div>
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  David Michael Osia
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Working on Interview Simulation Bug
                </p>
              </div>
            </div>
            <span style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              In Progress
            </span>
          </div>

          {/* Robert Labastera Jr. */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#8b5cf6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                Robe
              </div>
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  Robert Labastera Jr.
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Working on Card Payment Integration
                </p>
              </div>
            </div>
            <span style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              In Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  )
      default:
  return (
    <div style={{ flex: 1, padding: '2rem', backgroundColor: 'white' }}>
      <h1>Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
    </div>
  )
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
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        zIndex: 1
      }}></div>

      {/* Sidebar content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Logo */}
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
            const isActive = activeSection === item.id

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
                  transition: 'all 0.2s'
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
              fontWeight: '500'
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
      {renderContent()}
    </div>
  </div>
)
}