import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Globe, Database, Briefcase, Calculator, Heart, TrendingUp, HardDrive } from 'lucide-react';

const LiveAIInterviewContentPage = () => {
  const navigate = useNavigate();

  const topics = [
    {
      id: 'software-engineering',
      title: 'Software Engineering',
      description: 'Master full-stack development, algorithms, system design, and scalable architecture',
      highlights: ['Data Structures & Algorithms', 'System Design', 'OOP Principles', 'Code Optimization'],
      icon: Code,
      color: '#3b82f6'
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Frontend, backend, responsive design, modern frameworks and best practices',
      highlights: ['Frontend Frameworks', 'Backend APIs', 'Responsive Design', 'Web Performance'],
      icon: Globe,
      color: '#8b5cf6'
    },
    {
      id: 'data-science',
      title: 'Data Science & Analytics',
      description: 'Machine learning, statistics, data visualization, and predictive modeling',
      highlights: ['Machine Learning', 'Statistical Analysis', 'Data Visualization', 'Predictive Modeling'],
      icon: TrendingUp,
      color: '#10b981'
    },
    {
      id: 'business-management',
      title: 'Business Management',
      description: 'Leadership, strategy, operations, project management, and team dynamics',
      highlights: ['Strategic Planning', 'Team Leadership', 'Operations Management', 'Agile & Scrum'],
      icon: Briefcase,
      color: '#f59e0b'
    },
    {
      id: 'accounting-finance',
      title: 'Accounting & Finance',
      description: 'Financial analysis, auditing, tax planning, and bookkeeping excellence',
      highlights: ['Financial Analysis', 'Tax Planning', 'Auditing', 'Financial Modeling'],
      icon: Calculator,
      color: '#06b6d4'
    },
    {
      id: 'healthcare-medical',
      title: 'Healthcare & Medical',
      description: 'Clinical skills, patient care, medical knowledge, and healthcare protocols',
      highlights: ['Patient Care', 'Clinical Skills', 'Medical Procedures', 'Healthcare Compliance'],
      icon: Heart,
      color: '#ef4444'
    },
    {
      id: 'marketing-sales',
      title: 'Marketing & Sales',
      description: 'Digital marketing, branding, customer relations, and sales strategies',
      highlights: ['Digital Marketing', 'Brand Strategy', 'Sales Techniques', 'Customer Relations'],
      icon: TrendingUp,
      color: '#ec4899'
    },
    {
      id: 'database-administration',
      title: 'Database Administration',
      description: 'SQL, NoSQL, database design, optimization, and data security',
      highlights: ['SQL & NoSQL', 'Query Optimization', 'Database Security', 'Backup & Recovery'],
      icon: HardDrive,
      color: '#6366f1'
    }
  ];

  const handleTopicSelect = (topic) => {
    navigate('/live-ai-interview', { state: { topic: topic.title } });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: '3rem 2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          margin: 0
        }}>
          Choose Your Interview Topic
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Select a category to begin your personalized AI interview experience
        </p>
      </div>

      {/* Topics Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.id}
                onClick={() => handleTopicSelect(topic)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = topic.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: `${topic.color}15`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <Icon size={32} color={topic.color} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.75rem',
                  margin: 0
                }}>
                  {topic.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.95rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  {topic.description}
                </p>

                {/* Highlights */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {topic.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.375rem 0.75rem',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        borderRadius: '6px',
                        fontWeight: '500'
                      }}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Arrow indicator */}
                <div style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: topic.color,
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Start Interview
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveAIInterviewContentPage;
