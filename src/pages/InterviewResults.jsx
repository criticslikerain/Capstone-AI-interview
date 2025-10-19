import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  User, 
  Settings,
  Star,
  MessageSquare,
  Lightbulb,
  Download
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import { analyzeAnswer } from '../services/aiAnalysisService';
import jsPDF from 'jspdf';

const InterviewResults = ({ onLogout }) => {
  const navigate = useNavigate();
  const [interviewData, setInterviewData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviewData();
  }, []);

  const loadInterviewData = async () => {
    try {
      const messages = JSON.parse(localStorage.getItem('interview_messages') || '[]');
      const config = JSON.parse(sessionStorage.getItem('interviewConfig') || '{}');
      
      // Extract Q&A pairs
      const qaList = [];
      for (let i = 1; i < messages.length; i++) {
        if (messages[i].role === 'assistant' && messages[i + 1]?.role === 'user') {
          qaList.push({
            question: messages[i].content,
            answer: messages[i + 1].content
          });
        }
      }

      setInterviewData({
        qaList: qaList.slice(0, 5),
        config
      });

      // Generate AI analysis
      if (qaList.length > 0) {
        const analysisPrompt = qaList.map((qa, idx) => 
          `Q${idx + 1}: ${qa.question}\nA${idx + 1}: ${qa.answer}`
        ).join('\n\n');
        
        const analysis = await analyzeAnswer(
          'Overall Interview Performance',
          analysisPrompt
        );
        setAiAnalysis(analysis);
      }
    } catch (error) {
      console.error('Error loading interview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    if (!interviewData?.qaList) return 0;
    const avgLength = interviewData.qaList.reduce((sum, qa) => sum + qa.answer.length, 0) / interviewData.qaList.length;
    return Math.min(5, Math.max(1, Math.round(avgLength / 50)));
  };

  const exportToPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Logo
    doc.setFillColor(6, 182, 212);
    doc.circle(pageWidth - 25, 15, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('IP', pageWidth - 28, 18);
    doc.setTextColor(0, 0, 0);

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('InterviewPro', margin, yPosition);
    yPosition += 10;
    doc.setFontSize(16);
    doc.text('Interview Analysis Report', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(14);
    doc.text(`Overall Score: ${calculateScore()}/5`, margin, yPosition);
    yPosition += 15;

    // Questions and Answers
    interviewData?.qaList.forEach((qa, idx) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Question ${idx + 1}:`, margin, yPosition);
      yPosition += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const qLines = doc.splitTextToSize(qa.question, pageWidth - 2 * margin);
      doc.text(qLines, margin, yPosition);
      yPosition += qLines.length * 5 + 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Your Answer:`, margin, yPosition);
      yPosition += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const aLines = doc.splitTextToSize(qa.answer, pageWidth - 2 * margin);
      doc.text(aLines, margin, yPosition);
      yPosition += aLines.length * 5 + 10;
    });

    // AI Analysis
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Analysis:', margin, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const analysisLines = doc.splitTextToSize(aiAnalysis, pageWidth - 2 * margin);
    
    for (let i = 0; i < analysisLines.length; i++) {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(analysisLines[i], margin, yPosition);
      yPosition += 5;
    }

    doc.save(`InterviewPro-Results-${Date.now()}.pdf`);
  };

  const handleNavigation = (itemId) => {
    switch(itemId) {
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

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'past-interviews', icon: Clock, label: 'Past Interviews' },
    { id: 'live-interview', icon: Zap, label: 'Live AI Interview' },
    { id: 'question-bank', icon: HelpCircle, label: 'Question Bank' },
    { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const score = calculateScore();
  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 3,
    shape: Math.random() > 0.5 ? 'triangle' : 'circle'
  }));

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
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
              const Icon = item.icon;
              const isActive = item.id === 'live-interview';
              
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

      {/* Main Content */}
      <div style={{
        marginLeft: '280px',
        width: 'calc(100vw - 280px)',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Confetti */}
        {confettiParticles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              top: '-10px',
              width: particle.shape === 'triangle' ? '0' : '8px',
              height: particle.shape === 'triangle' ? '0' : '8px',
              backgroundColor: particle.shape === 'circle' ? '#fbbf24' : 'transparent',
              borderRadius: particle.shape === 'circle' ? '50%' : '0',
              borderLeft: particle.shape === 'triangle' ? '4px solid transparent' : 'none',
              borderRight: particle.shape === 'triangle' ? '4px solid transparent' : 'none',
              borderBottom: particle.shape === 'triangle' ? '8px solid #fbbf24' : 'none',
              animation: `fall 3s linear infinite`,
              animationDelay: `${particle.animationDelay}s`,
              zIndex: 1
            }}
          />
        ))}

        {/* Score Display */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            fontSize: '8rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            {score}
          </div>

          <div style={{
            width: '100px',
            height: '4px',
            backgroundColor: 'white',
            marginBottom: '2rem',
            borderRadius: '2px'
          }}></div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                fill={star <= score ? '#fbbf24' : 'transparent'}
                color={star <= score ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)'}
              />
            ))}
          </div>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: '400',
            margin: 0,
            marginBottom: '2rem'
          }}>
            {score >= 4 ? 'Excellent' : score >= 3 ? 'Good' : 'Needs Improvement'}
          </h2>
        </div>

        {/* Results Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '24px 24px 0 0',
          color: '#374151',
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* Export Button */}
            <button
              onClick={exportToPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '2rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              <Download size={18} />
              Export PDF Report
            </button>

            {/* Questions and Answers */}
            {interviewData?.qaList.map((qa, idx) => (
              <div key={idx} style={{ marginBottom: '2rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#06b6d4',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {idx + 1}
                  </div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: 0,
                    color: '#374151'
                  }}>
                    Question {idx + 1}
                  </h3>
                </div>
                
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '0.75rem'
                }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {qa.question}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  Your Answer:
                </div>

                <div style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '12px',
                  padding: '1rem'
                }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: '#0c4a6e' }}>
                    {qa.answer}
                  </p>
                </div>
              </div>
            ))}

            {/* AI Analysis */}
            <div style={{ marginTop: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#fbbf24',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Lightbulb size={18} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0,
                  color: '#374151'
                }}>
                  AI Analysis & Recommendations
                </h3>
              </div>
              
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#4b5563',
                whiteSpace: 'pre-wrap'
              }}>
                {aiAnalysis || 'Generating analysis...'}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => navigate('/user-dashboard')}
              style={{
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
                transition: 'all 0.2s',
                marginTop: '2rem'
              }}
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewResults;
