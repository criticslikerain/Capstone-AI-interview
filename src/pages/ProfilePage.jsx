import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Home,
  Clock,
  Zap,
  HelpCircle,
  CreditCard,
  User,
  Settings,
  Mail
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const ProfilePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'David Michael',
    lastName: 'Osia',
    email: 'davidmichael@workmail.com',
    phoneNumber: '09123456789',
    address: '8th Street, New Foundland, Southhampton'
  });

  const handleNavigation = (itemId) => {
    switch (itemId) {
      case 'dashboard':
        navigate('/user-dashboard');
        break;
      case 'live-interview':
        navigate('/live-ai-interview');
        break;
      case 'past-interviews':
        navigate('/weakness-overview');
        break;
      case 'question-bank':
        navigate('/question-bank');
        break;
      case 'subscriptions':
        navigate('/my-plan');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'past-interviews', icon: Clock, label: 'Past Interviews' },
    { id: 'live-interview', icon: Zap, label: 'Live AI Interview' },
    { id: 'question-bank', icon: HelpCircle, label: 'Question Bank' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Sidebar - nindot nga sidebar */}
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
          {/* Logo Section - logo sa InterviewPro */}
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

          {/* Navigation - mga navigation items */}
          <nav style={{ flex: 1, padding: '1rem 0' }}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'profile'; // Profile is active

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
                    if (!isActive) e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.7)';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content - profile interface */}
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
            {/* Header content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '800px',
              margin: '0 auto',
              padding: '0 2rem'
            }}>
              {/* Profile Picture */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                overflow: 'hidden'
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

              {/* Name and Email */}
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                David Michael Osia
              </h1>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '2rem'
              }}>
                <Mail size={16} />
                <span style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  DavidMichaelOsia@gmail.com
                </span>
              </div>

              {/* Stats */}
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
                    3
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
                    4
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
                    4.3
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
              {/* Form Fields */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                {/* First Name */}
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

                {/* Last Name */}
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

                {/* Email */}
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

                {/* Phone Number */}
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

                {/* Address */}
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

              {/* Update Button */}
              <div style={{ marginTop: '2rem' }}>
                <button style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                  transition: 'all 0.2s'
                }}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;