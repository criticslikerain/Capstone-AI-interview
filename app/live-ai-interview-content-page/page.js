'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, ChevronRight, Check } from 'lucide-react'

export default function LiveAIInterviewContentPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [visibleSections, setVisibleSections] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const sectionRefs = useRef([])
  const audioRef = useRef(null)


  // if ever the reader is confused about this, gibutangan ra nakog ghost text so that maka proper
  // execute ang letter writing, kay ang welcome generation seems deformed.
  const fullText = `‎ ‎ ‎ ‎ Welcome to the Interview Category Selection page! Here's how it works:

This page helps you choose the perfect interview category based on your career goals and the role you're preparing for.

Each category contains hundreds of carefully crafted questions designed by industry experts. When you select a category, you'll be taken to the interview setup page where you can customize your practice session.

You can choose from 8 specialized categories including Software Engineering, Web Development, Data Science, Business Management, Accounting & Finance, Healthcare, Marketing & Sales, and Database Administration.

After selecting your category, you'll configure your interview type (behavioral, technical, or situational), difficulty level (beginner, intermediate, or advanced), and recording preferences.

The AI interviewer will then conduct a realistic mock interview tailored to your chosen field, asking relevant questions and providing detailed feedback on your responses.

This personalized approach ensures you're practicing the most relevant questions for your target role, helping you build confidence and improve your interview skills effectively.‎ ‎ ‎ `

  useEffect(() => {
    setIsLoaded(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.dataset.index]: true
            }))
          }
        })
      },
      { threshold: 0.2 }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (showModal) {
      setDisplayedText('')
      let index = 0
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText((prev) => prev + fullText[index])
          index++
        } else {
          clearInterval(interval)
        }
      }, 0.5)
      return () => clearInterval(interval)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlayingAudio(false)
      }
    }
  }, [showModal])

  const playRandomAudio = () => {
    const voices = ['voice1.mp3', 'voice2.mp3', 'voice3.mp3']
    const randomVoice = voices[Math.floor(Math.random() * voices.length)]

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    audioRef.current = new Audio(`/assets/audios/${randomVoice}`)
    audioRef.current.play()
    setIsPlayingAudio(true)

    audioRef.current.onended = () => {
      setIsPlayingAudio(false)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlayingAudio(false)
    }
  }

  const interviewCategories = [
    {
      id: 'software-engineering',
      title: 'Software Engineering',
      description: 'Master full-stack development, algorithms, system design, and scalable architecture. Perfect for aspiring software engineers looking to excel in technical interviews.',
      longDescription: 'Dive deep into data structures, algorithms, object-oriented programming, and system design patterns. Practice coding challenges and architectural questions.',
      image: '/assets/images/software-engineering.jpg',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      stats: '500+ Questions',
      highlights: ['Data Structures & Algorithms', 'System Design', 'OOP Principles', 'Code Optimization']
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Frontend, backend, responsive design, modern frameworks and best practices. Build your expertise in creating dynamic web applications.',
      longDescription: 'Learn React, Vue, Angular, Node.js, and modern web technologies. Master responsive design, API integration, and performance optimization.',
      image: '/assets/images/web-development.jpg',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      stats: '450+ Questions',
      highlights: ['Frontend Frameworks', 'Backend APIs', 'Responsive Design', 'Web Performance']
    },
    {
      id: 'data-science',
      title: 'Data Science & Analytics',
      description: 'Machine learning, statistics, data visualization, and predictive modeling. Transform data into actionable insights.',
      longDescription: 'Practice Python, R, SQL, machine learning algorithms, statistical analysis, and data visualization techniques for real-world applications.',
      image: '/assets/images/data-science.jpg',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      stats: '400+ Questions',
      highlights: ['Machine Learning', 'Statistical Analysis', 'Data Visualization', 'Predictive Modeling']
    },
    {
      id: 'business-management',
      title: 'Business Management',
      description: 'Leadership, strategy, operations, project management, and team dynamics. Develop skills to lead and manage effectively.',
      longDescription: 'Master strategic planning, team leadership, operational efficiency, and project management methodologies like Agile and Scrum.',
      image: '/assets/images/business-management.jpg',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      stats: '350+ Questions',
      highlights: ['Strategic Planning', 'Team Leadership', 'Operations Management', 'Agile & Scrum']
    },
    {
      id: 'accounting-finance',
      title: 'Accounting & Finance',
      description: 'Financial analysis, auditing, tax planning, and bookkeeping excellence. Build expertise in financial management.',
      longDescription: 'Practice financial statements, tax regulations, auditing procedures, and financial modeling for corporate and personal finance.',
      image: '/assets/images/accounting-finance.jpg',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      stats: '380+ Questions',
      highlights: ['Financial Analysis', 'Tax Planning', 'Auditing', 'Financial Modeling']
    },
    {
      id: 'healthcare-medical',
      title: 'Healthcare & Medical',
      description: 'Clinical skills, patient care, medical knowledge, and healthcare protocols. Prepare for medical and healthcare roles.',
      longDescription: 'Cover patient assessment, medical procedures, healthcare regulations, and clinical decision-making for various medical specialties.',
      image: '/assets/images/healthcare-medical.jpg',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      stats: '420+ Questions',
      highlights: ['Patient Care', 'Clinical Skills', 'Medical Procedures', 'Healthcare Compliance']
    },
    {
      id: 'marketing-sales',
      title: 'Marketing & Sales',
      description: 'Digital marketing, branding, customer relations, and sales strategies. Master the art of persuasion and growth.',
      longDescription: 'Learn SEO, social media marketing, content strategy, sales funnels, and customer relationship management techniques.',
      image: '/assets/images/marketing-sales.jpg',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      stats: '370+ Questions',
      highlights: ['Digital Marketing', 'Brand Strategy', 'Sales Techniques', 'Customer Relations']
    },
    {
      id: 'database-administration',
      title: 'Database Administration',
      description: 'SQL, NoSQL, database design, optimization, and data security. Become a database expert.',
      longDescription: 'Master database architecture, query optimization, backup strategies, and security protocols for both SQL and NoSQL systems.',
      image: '/assets/images/database-administration.jpg',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      stats: '340+ Questions',
      highlights: ['SQL & NoSQL', 'Query Optimization', 'Database Security', 'Backup & Recovery']
    }
  ]

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    sessionStorage.setItem('interviewCategory', categoryId)
    setTimeout(() => {
      router.push('/live-ai-interview')
    }, 600)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .smooth-scroll {
          scroll-behavior: smooth;
        }

        .gradient-text {
          background: linear-gradient(135deg, #66b7ff 0%, #4facfe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-visible .image-container {
          animation: slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .section-visible .content-container {
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @media (max-width: 1024px) {
          .category-section {
            flex-direction: column !important;
            min-height: auto !important;
          }
          
          .image-container, .content-container {
            width: 100% !important;
          }
        }
      `}</style>

      <div className="smooth-scroll" style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 50%, #ffffff 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        position: 'relative',
        overflow: 'auto'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          opacity: 0.03,
          zIndex: 0
        }}>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, #667eea 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, #764ba2 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite'
          }}></div>
        </div>

        {/* Content Container */}
        <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
          {/* Back Button */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            marginBottom: '2rem',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in'
          }}>
            <button
              onClick={() => router.push('/user-dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.transform = 'translateX(-4px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
                e.currentTarget.style.transform = 'translateX(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>

          {/* Hero Header Section */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            marginBottom: '4rem',
            textAlign: 'center',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                backgroundColor: 'rgba(79, 172, 254, 0.1)',
                borderRadius: '50px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(79, 172, 254, 0.2)'
              }}>
                <Sparkles size={16} color="#4facfe" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#4facfe'
                }}>
                  AI-Powered Interview Practice
                </span>
              </div>

              {/* Help Button */}
              <button
                onClick={() => setShowModal(true)}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-120px',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  border: '2px solid #667eea',
                  borderRadius: '50px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#667eea',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                  animation: 'float 3s ease-in-out infinite'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#667eea'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.color = '#667eea'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Need help?
              </button>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: '800',
              marginBottom: '1.25rem',
              lineHeight: '1.2',
              letterSpacing: '-0.02em'
            }}>
              <span className="gradient-text">
                Choose Your Interview Category
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Select your field and get tailored interview questions designed by industry experts.
              Practice with AI and ace your next interview.
            </p>
          </div>

          {/* Category Sections - Scroll Based */}
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {interviewCategories.map((category, index) => {
              const isSelected = selectedCategory === category.id
              const isVisible = visibleSections[index]

              return (
                <div
                  key={category.id}
                  ref={(el) => (sectionRefs.current[index] = el)}
                  data-index={index}
                  className={`category-section ${isVisible ? 'section-visible' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '40vh',
                    marginBottom: '4rem',
                    gap: '3rem',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.6s ease'
                  }}
                >
                  {/* Image Container - Left Side */}
                  <div
                    className="image-container"
                    style={{
                      flex: '0 0 45%',
                      position: 'relative',
                      height: '400px',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                      opacity: 0
                    }}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <img
                      src={category.image}
                      alt={category.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)'
                    }}></div>

                    {/* Stats Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '50px',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#374151',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                      {category.stats}
                    </div>

                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '1.5rem',
                        left: '1.5rem',
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#667eea',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.5)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }}>
                        <Check size={28} color="white" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Content Container - Right Side */}
                  <div
                    className="content-container"
                    style={{
                      flex: 1,
                      opacity: 0
                    }}
                  >
                    <div style={{
                      display: 'inline-block',
                      padding: '0.5rem 1.25rem',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      borderRadius: '50px',
                      marginBottom: '1.5rem',
                      border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#667eea'
                      }}>
                        Category {index + 1} of {interviewCategories.length}
                      </span>
                    </div>

                    <h2 style={{
                      fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                      fontWeight: '800',
                      color: '#111827',
                      marginBottom: '1rem',
                      lineHeight: '1.2'
                    }}>
                      {category.title}
                    </h2>

                    <p style={{
                      fontSize: '1.125rem',
                      color: '#6b7280',
                      lineHeight: '1.7',
                      marginBottom: '1.5rem'
                    }}>
                      {category.description}
                    </p>

                    <p style={{
                      fontSize: '1rem',
                      color: '#9ca3af',
                      lineHeight: '1.6',
                      marginBottom: '2rem'
                    }}>
                      {category.longDescription}
                    </p>

                    {/* Highlights */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem',
                      marginBottom: '2rem'
                    }}>
                      {category.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(102, 126, 234, 0.1)'
                          }}
                        >
                          <div style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#667eea',
                            borderRadius: '50%'
                          }}></div>
                          <span style={{
                            fontSize: '0.875rem',
                            color: '#374151',
                            fontWeight: '500'
                          }}>
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Select Button */}
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      style={{
                        padding: '1rem 2.5rem',
                        backgroundColor: isSelected ? '#667eea' : 'white',
                        color: isSelected ? 'white' : '#667eea',
                        border: `2px solid #667eea`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.3s ease',
                        boxShadow: isSelected ? '0 8px 20px rgba(102, 126, 234, 0.3)' : 'none'
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = '#667eea'
                          e.currentTarget.style.color = 'white'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'white'
                          e.currentTarget.style.color = '#667eea'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check size={20} />
                          Selected - Continue
                        </>
                      ) : (
                        <>
                          Select This Category
                          <ChevronRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Info Card */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto 3rem',
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            textAlign: 'center',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in 0.5s'
          }}>
            <div style={{
              display: 'inline-block',
              width: '80px',
              height: '80px',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <img
                src="/assets/images/problem.PNG"
                alt="Expert Questions"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(102, 126, 234, 0.15))'
                }}
              />
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Expert-Designed Questions
            </h3>
            <p style={{
              fontSize: '1.0625rem',
              color: '#6b7280',
              lineHeight: '1.7',
              margin: 0,
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Each category includes industry-specific questions crafted by professionals.
              Practice multiple categories to broaden your interview skills and boost your confidence.
            </p>
          </div>
        </div>

        {/* Help Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '2rem',
              animation: 'fadeIn 0.3s ease'
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                animation: 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '2rem 2.5rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem'
                  }}>
                    <img
                      src="/assets/images/clearcommunication.PNG"
                      alt="How This Works"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#111827',
                      margin: 0
                    }}>
                      How This Works
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      Understanding the category selection
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {/* Audio Button */}
                  <button
                    onClick={isPlayingAudio ? stopAudio : playRandomAudio}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isPlayingAudio ? '#667eea' : '#f3f4f6',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = isPlayingAudio ? '#5568d3' : '#e5e7eb'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = isPlayingAudio ? '#667eea' : '#f3f4f6'
                    }}
                  >
                    {isPlayingAudio ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isPlayingAudio ? 'white' : '#6b7280'}>
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                      </svg>
                    )}
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#f3f4f6',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#e5e7eb'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content with Typewriter Effect */}
              <div style={{
                padding: '2.5rem',
                fontSize: '1.0625rem',
                lineHeight: '1.8',
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'pre-wrap'
              }}>
                {displayedText}
                <span style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1.2em',
                  backgroundColor: '#667eea',
                  marginLeft: '2px',
                  animation: 'blink 1s step-end infinite',
                  verticalAlign: 'text-bottom'
                }}></span>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '1.5rem 2.5rem',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#5568d3'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#667eea'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
