import React from 'react';
import { useRouter } from 'next/router';
import {
  Home,
  Clock,
  Zap,
  HelpCircle,
  CreditCard,
  User,
  Settings,
  LogIn,
  UserPlus,
  Mail,
  Shield,
  BarChart3,
  Mic,
  Award,
  AlertTriangle,
  DollarSign,
  Grid3X3
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const CategoriesPage = () => {
  const navigate = useNavigate();

  const allRoutes = [
    // Authentication Routes
    {
      category: 'Authentication',
      routes: [
        { path: '/login', name: 'Login', icon: LogIn, description: 'User login page' },
        { path: '/signup', name: 'Sign Up', icon: UserPlus, description: 'User registration page' },
        { path: '/forgot-password', name: 'Forgot Password', icon: Shield, description: 'Password recovery page' },
        { path: '/email-verification', name: 'Email Verification', icon: Mail, description: 'Email verification page' },
        { path: '/setup-profile', name: 'Setup Profile', icon: User, description: 'Profile setup after registration' }
      ]
    },
    // Dashboard Routes
    {
      category: 'Dashboards',
      routes: [
        { path: '/dashboard', name: 'Admin Dashboard', icon: BarChart3, description: 'Admin control panel' },
        { path: '/user-dashboard', name: 'User Dashboard', icon: Home, description: 'Main user dashboard with performance overview' }
      ]
    },
    {
      category: 'Interview System',
      routes: [
        { path: '/live-ai-interview', name: 'Live AI Interview Setup', icon: Zap, description: 'Mock interview setup and configuration' },
        { path: '/voice-interview', name: 'Voice Interview', icon: Mic, description: 'Active voice interview session' },
        { path: '/interview-results', name: 'Interview Results', icon: Award, description: 'Interview completion and results page' }
      ]
    },
    // Analysis Routes
    {
      category: 'Performance Analysis',
      routes: [
        { path: '/weakness-overview', name: 'Weakness Overview', icon: AlertTriangle, description: 'Detailed weakness analysis and improvement tips' }
      ]
    },
    {
      category: 'Content & Resources',
      routes: [
        { path: '/question-bank', name: 'Question Bank', icon: HelpCircle, description: 'Browse interview questions by category' }
      ]
    },
    // Account Management Routes
    {
      category: 'Account Management',
      routes: [
        { path: '/profile', name: 'Profile', icon: User, description: 'User profile and personal information' },
        { path: '/my-plan', name: 'My Plan (Subscriptions)', icon: CreditCard, description: 'Subscription management and billing' },
        { path: '/pricing', name: 'Pricing Plans', icon: DollarSign, description: 'View and select subscription plans' },
        { path: '/settings', name: 'Settings', icon: Settings, description: 'App preferences and customization' }
      ]
    },
    // Utility Routes
    {
      category: 'Utility',
      routes: [
        { path: '/categories', name: 'Categories (This Page)', icon: Grid3X3, description: 'Site navigation overview' }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem'
        }}>
          <ChatBubbleLogo size={80} />
          <div style={{ textAlign: 'left' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: 0,
              marginBottom: '0.5rem'
            }}>
              InterviewPro Categories
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0
            }}>
              Navigate to any page in the InterviewPro application
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        {allRoutes.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            style={{
              marginBottom: '3rem'
            }}
          >
            {/* Category Header */}
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #06b6d4'
            }}>
              {category.category}
            </h2>

            {/* Route Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}>
              {category.routes.map((route, routeIndex) => {
                const Icon = route.icon;
                return (
                  <div
                    key={routeIndex}
                    onClick={() => handleNavigation(route.path)}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#06b6d4';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#06b6d4',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={24} color="white" />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#374151',
                        margin: 0,
                        marginBottom: '0.5rem'
                      }}>
                        {route.name}
                      </h3>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        margin: 0,
                        marginBottom: '0.75rem',
                        lineHeight: '1.4'
                      }}>
                        {route.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <code style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace'
                        }}>
                          {route.path}
                        </code>
                        <span style={{
                          color: '#06b6d4',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          Click to navigate →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CategoriesPage;