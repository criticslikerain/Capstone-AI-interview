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
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Eye,
  Loader
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';
import AnalysisModal from '../components/AnalysisModal';
import { fetchQuestionsFromAPI, getUserQuestionData, saveUserQuestionData, saveUserAnswer, saveAIAnalysis, shouldRefetchQuestions } from '../services/questionBankService';
import { analyzeAnswer } from '../services/aiAnalysisService';
import { auth } from '../../lib/firebase';

const QuestionBank = ({ onLogout }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState({});
  const [modalData, setModalData] = useState({ isOpen: false, analysis: '', category: '', question: '' });
  const userId = auth.currentUser?.uid;

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
        // Future implementation
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

  const questionCategories = [
    {
      id: 'behavioral',
      title: 'Behavioral Questions',
      description: 'Assess how you\'ve handled real-life situations.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.5 2.5 0 0 0 8 7H5.46c-.8 0-1.49.59-1.42 1.37L6.5 16H9v6h2v-6h2v6h4z"/>
        </svg>
      ),
      color: '#ef4444',
      count: '5 Questions'
    },
    {
      id: 'technical',
      title: 'Technical Questions',
      description: 'Test your domain expertise with industry-related problems.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
      ),
      color: '#06b6d4',
      count: '5 Questions'
    },
    {
      id: 'problem-solving',
      title: 'Problem-Solving Questions',
      description: 'Demonstrate your logical thinking and creativity.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          <path d="M12 6.5l1.5 3L17 10l-2.5 2.5L15 16l-3-1.5L9 16l.5-3.5L7 10l3.5-.5L12 6.5z" fill="rgba(255,255,255,0.3)"/>
        </svg>
      ),
      color: '#f59e0b',
      count: '5 Questions'
    }
  ];

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    for (const category of questionCategories) {
      const userData = await getUserQuestionData(userId, category.id);
      if (userData) {
        setCategoryData(prev => ({ ...prev, [category.id]: userData }));
        setUserAnswers(prev => ({ ...prev, [category.id]: userData.answers || {} }));
      }
    }
  };

  const handleCategoryClick = async (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      return;
    }

    setExpandedCategory(categoryId);

    if (!categoryData[categoryId] || categoryData[categoryId].questions?.length === 0) {
      setLoading(prev => ({ ...prev, [categoryId]: true }));
      try {
        const userData = await getUserQuestionData(userId, categoryId);
        
        if (userData && !shouldRefetchQuestions(userData)) {
          setCategoryData(prev => ({ ...prev, [categoryId]: userData }));
          setUserAnswers(prev => ({ ...prev, [categoryId]: userData.answers || {} }));
        } else {
          const data = await fetchQuestionsFromAPI(categoryId);
          await saveUserQuestionData(userId, categoryId, {
            batchId: data.batchId,
            questions: data.questions,
            fetchDate: data.fetchDate,
            answers: {}
          });
          setCategoryData(prev => ({ ...prev, [categoryId]: data }));
          setUserAnswers(prev => ({ ...prev, [categoryId]: {} }));
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(prev => ({ ...prev, [categoryId]: false }));
      }
    }
  };

  const handleAnswerChange = (categoryId, questionIndex, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [questionIndex]: {
          ...prev[categoryId]?.[questionIndex],
          answer: value
        }
      }
    }));
  };

  const handleSubmitAnswer = async (categoryId, questionIndex, question) => {
    const answer = userAnswers[categoryId]?.[questionIndex]?.answer;
    if (!answer || !answer.trim()) return;

    try {
      await saveUserAnswer(userId, categoryId, questionIndex, answer);
      setUserAnswers(prev => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [questionIndex]: {
            ...prev[categoryId][questionIndex],
            answeredAt: new Date(),
            analyzed: false
          }
        }
      }));

      setAnalyzing(prev => ({ ...prev, [`${categoryId}_${questionIndex}`]: true }));
      const analysis = await analyzeAnswer(question, answer);
      await saveAIAnalysis(userId, categoryId, questionIndex, analysis);
      
      setUserAnswers(prev => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [questionIndex]: {
            ...prev[categoryId][questionIndex],
            analysis,
            analyzed: true
          }
        }
      }));
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setAnalyzing(prev => ({ ...prev, [`${categoryId}_${questionIndex}`]: false }));
    }
  };

  const handleViewAnalysis = (categoryId, questionIndex, question) => {
    const analysis = userAnswers[categoryId]?.[questionIndex]?.analysis;
    if (analysis) {
      setModalData({
        isOpen: true,
        analysis,
        category: categoryId,
        question,
        allAnswers: null
      });
    }
  };

  const handleViewSummaryAnalysis = async (categoryId) => {
    const questions = categoryData[categoryId]?.questions || [];
    const answers = userAnswers[categoryId] || {};
    
    const qaList = questions.map((q, idx) => ({
      question: q,
      answer: answers[idx]?.answer || 'No answer provided'
    })).filter(qa => qa.answer !== 'No answer provided');

    if (qaList.length === 0) return;

    setAnalyzing(prev => ({ ...prev, [`${categoryId}_summary`]: true }));
    
    const combinedText = qaList.map((qa, idx) => 
      `Question ${idx + 1}: ${qa.question}\n\nYour Answer: ${qa.answer}`
    ).join('\n\n---\n\n');

    const summaryAnalysis = await analyzeAnswer(
      `Summary Analysis for ${categoryId} category (${qaList.length} questions)`,
      combinedText
    );

    setAnalyzing(prev => ({ ...prev, [`${categoryId}_summary`]: false }));

    setModalData({
      isOpen: true,
      analysis: summaryAnalysis,
      category: categoryId,
      question: `Summary Analysis - ${qaList.length} Questions`,
      allAnswers: qaList
    });
  };

  const getAnsweredCount = (categoryId) => {
    const answers = userAnswers[categoryId] || {};
    return Object.values(answers).filter(a => a.answeredAt).length;
  };

  const filteredCategories = questionCategories.filter(cat => {
    if (!searchQuery) return true;
    const questions = categoryData[cat.id]?.questions || [];
    return questions.some(q => q.toLowerCase().includes(searchQuery.toLowerCase()));
  });

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
              const isActive = item.id === 'question-bank'; // Question Bank is active
              
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

      {/* Main Content - question bank interface */}
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
            paddingTop: '3rem',
            paddingBottom: '4rem',
            color: 'white',
            textAlign: 'center'
          }}>
            {/* Header content */}
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
              {/* Question Bank Icon */}
              <div style={{
                flexShrink: 0
              }}>
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                  {/* Question Mark Background */}
                  <circle cx="35" cy="35" r="25" fill="#fbbf24"/>
                  <text x="35" y="45" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">?</text>
                  
                  {/* Chat Bubbles */}
                  <ellipse cx="65" cy="25" rx="18" ry="12" fill="#06b6d4"/>
                  <ellipse cx="70" cy="45" rx="15" ry="10" fill="#8b5cf6"/>
                  <ellipse cx="60" cy="65" rx="12" ry="8" fill="#ef4444"/>
                  
                  {/* Dots in bubbles */}
                  <circle cx="60" cy="25" r="2" fill="white"/>
                  <circle cx="65" cy="25" r="2" fill="white"/>
                  <circle cx="70" cy="25" r="2" fill="white"/>
                  
                  <circle cx="66" cy="45" r="1.5" fill="white"/>
                  <circle cx="70" cy="45" r="1.5" fill="white"/>
                  <circle cx="74" cy="45" r="1.5" fill="white"/>
                  
                  <circle cx="58" cy="65" r="1" fill="white"/>
                  <circle cx="61" cy="65" r="1" fill="white"/>
                  <circle cx="64" cy="65" r="1" fill="white"/>
                </svg>
              </div>
              
              {/* Text content */}
              <div style={{ textAlign: 'left' }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  marginBottom: '0.75rem'
                }}>
                  Question Bank
                </h1>
                
                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Explore a variety of interview questions categorized by type. Select a category to practice and improve your responses.
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div style={{
            width: '100%',
            margin: '0 auto',
            padding: '0.5rem',
            marginTop: '2rem',
            position: 'relative',
            zIndex: 3
          }}>
            {/* Search and Filter Section */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {/* Search Bar */}
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
                <Search 
                  size={20} 
                  color="#9ca3af" 
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
              
              {/* Search Button */}
              <button style={{
                padding: '0.875rem 1.5rem',
                backgroundColor: '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Search
              </button>
              
              {/* Filter Button */}
              <button style={{
                padding: '0.875rem',
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Filter size={20} />
              </button>
            </div>

            {/* Question By Category Section */}
            <div style={{
              backgroundColor: 'transparent',
              padding: '2rem',
              boxShadow: 'none'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#06b6d4',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <HelpCircle size={18} color="white" />
                  </div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#374151',
                    margin: 0
                  }}>
                    Question By Category
                  </h2>
                </div>
                
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
              
              {/* Category Cards */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {filteredCategories.map((category) => {
                  const isExpanded = expandedCategory === category.id;
                  const answeredCount = getAnsweredCount(category.id);
                  
                  return (
                    <div key={category.id} style={{ width: '100%' }}>
                      <div
                        onClick={() => handleCategoryClick(category.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          transform: isExpanded ? 'scale(1.02)' : 'scale(1)'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flex: 1
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: category.color,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            position: 'relative'
                          }}>
                            {category.icon}
                            {answeredCount > 0 && (
                              <div style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}>
                                {answeredCount}
                              </div>
                            )}
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#374151',
                              margin: 0,
                              marginBottom: '0.25rem'
                            }}>
                              {category.title}
                            </h3>
                            <p style={{
                              color: '#6b7280',
                              fontSize: '0.875rem',
                              margin: 0
                            }}>
                              {category.description}
                            </p>
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: category.color,
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {category.count}
                          </span>
                          {isExpanded ? <ChevronDown size={20} color="#9ca3af" /> : <ChevronRight size={20} color="#9ca3af" />}
                        </div>
                      </div>

                      {/* Expanded Questions */}
                      {isExpanded && (
                        <div style={{
                          marginTop: '0.5rem',
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          animation: 'slideDown 0.3s ease-out'
                        }}>
                          {loading[category.id] ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                              <Loader size={32} color={category.color} style={{ animation: 'spin 1s linear infinite' }} />
                              <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading questions...</p>
                            </div>
                          ) : (
                            categoryData[category.id]?.questions?.map((question, idx) => {
                              const answerData = userAnswers[category.id]?.[idx];
                              const isAnswered = answerData?.answeredAt;
                              const isAnalyzing = analyzing[`${category.id}_${idx}`];
                              
                              return (
                                <div key={idx} style={{
                                  marginBottom: '1.5rem',
                                  padding: '1rem',
                                  backgroundColor: '#f9fafb',
                                  borderRadius: '8px',
                                  borderLeft: `4px solid ${category.color}`
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '0.75rem'
                                  }}>
                                    <h4 style={{
                                      margin: 0,
                                      fontSize: '1rem',
                                      color: '#374151',
                                      flex: 1
                                    }}>
                                      {idx + 1}. {question}
                                    </h4>
                                    {isAnswered && (
                                      <CheckCircle size={20} color="#10b981" />
                                    )}
                                  </div>
                                  
                                  <textarea
                                    value={answerData?.answer || ''}
                                    onChange={(e) => handleAnswerChange(category.id, idx, e.target.value)}
                                    disabled={isAnswered}
                                    placeholder="Type your answer here..."
                                    style={{
                                      width: '100%',
                                      minHeight: '100px',
                                      padding: '0.75rem',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '8px',
                                      fontSize: '0.875rem',
                                      resize: 'vertical',
                                      backgroundColor: isAnswered ? '#f3f4f6' : 'white',
                                      cursor: isAnswered ? 'not-allowed' : 'text'
                                    }}
                                  />
                                  
                                  <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    marginTop: '0.75rem'
                                  }}>
                                    {!isAnswered ? (
                                      <button
                                        onClick={() => handleSubmitAnswer(category.id, idx, question)}
                                        disabled={!answerData?.answer?.trim() || isAnalyzing}
                                        style={{
                                          padding: '0.5rem 1rem',
                                          backgroundColor: category.color,
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '8px',
                                          cursor: answerData?.answer?.trim() ? 'pointer' : 'not-allowed',
                                          opacity: answerData?.answer?.trim() ? 1 : 0.5,
                                          fontSize: '0.875rem',
                                          fontWeight: '600'
                                        }}
                                      >
                                        {isAnalyzing ? 'Analyzing...' : 'Submit Answer'}
                                      </button>
                                    ) : (
                                      answerData.analyzed && (
                                        <button
                                          onClick={() => handleViewAnalysis(category.id, idx, question)}
                                          style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                          }}
                                        >
                                          <Eye size={16} />
                                          View AI Analysis
                                        </button>
                                      )
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                          
                          {/* Summary Analysis Button */}
                          {answeredCount >= 5 && (
                            <div style={{
                              marginTop: '1.5rem',
                              padding: '1rem',
                              backgroundColor: '#f0f9ff',
                              borderRadius: '8px',
                              border: '2px solid #06b6d4'
                            }}>
                              <button
                                onClick={() => handleViewSummaryAnalysis(category.id)}
                                disabled={analyzing[`${category.id}_summary`]}
                                style={{
                                  width: '100%',
                                  padding: '0.75rem 1.5rem',
                                  backgroundColor: '#06b6d4',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: analyzing[`${category.id}_summary`] ? 'not-allowed' : 'pointer',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem'
                                }}
                              >
                                <Eye size={18} />
                                {analyzing[`${category.id}_summary`] ? 'Generating Summary...' : 'View Complete Summary Analysis'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AnalysisModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        analysis={modalData.analysis}
        category={modalData.category}
        question={modalData.question}
      />
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QuestionBank;