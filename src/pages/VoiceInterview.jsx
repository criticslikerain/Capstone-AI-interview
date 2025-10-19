import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  User, 
  Settings,
  Mic,
  MoreVertical,
  MicOff,
  StopCircle
} from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const VoiceInterview = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [interviewConfig, setInterviewConfig] = useState(null);
  const audioPlayerRef = useRef(null);
  const recognitionRef = useRef(null);
  
  const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
  const ELEVEN_API_KEY = process.env.ELEVEN_LABS_API_KEY;
  const ELEVEN_VOICE_ID = process.env.ELEVEN_LABS_VOICE_ID;
  
  const professionMap = {
    'software-engineer': 'Software Engineer',
    'frontend-developer': 'Frontend Developer', 
    'backend-developer': 'Backend Developer',
    'fullstack-developer': 'Full Stack Developer',
    'data-scientist': 'Data Scientist',
    'product-manager': 'Product Manager',
    'ui-ux-designer': 'UI/UX Designer',
    'marketing-manager': 'Marketing Manager',
    'sales-representative': 'Sales Representative',
    'financial-analyst': 'Financial Analyst',
    'human-resources': 'Human Resources',
    'project-manager': 'Project Manager',
    'business-analyst': 'Business Analyst'
  };
  
  const professions = Object.values(professionMap);

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

  useEffect(() => {
    const config = sessionStorage.getItem('interviewConfig');
    if (config) {
      const parsedConfig = JSON.parse(config);
      setInterviewConfig(parsedConfig);
      if (parsedConfig.jobRole && professionMap[parsedConfig.jobRole]) {
        setSelectedProfession(professionMap[parsedConfig.jobRole]);
      }
    }
  }, []);
  
  useEffect(() => {
    let timer;
    if (interviewStarted) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [interviewStarted]);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = false;
      
      recognitionRef.current.onresult = (event) => {
        const speechText = event.results[0][0].transcript;
        handleUserResponse(speechText);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = async () => {
    if (!selectedProfession) return;
    
    setInterviewStarted(true);
    setQuestionCount(0);
    
    const topic = interviewConfig?.topic || 'Software Engineering';
    const interviewType = interviewConfig?.interviewType || 'behavioral';
    const difficulty = interviewConfig?.difficulty || 'intermediate';
    
    let systemPrompt = `You are a professional interviewer conducting a ${topic} interview for a ${selectedProfession} position.`;
    
    switch(interviewType) {
      case 'behavioral':
        systemPrompt += ` Focus on behavioral questions using the STAR method (Situation, Task, Action, Result). Ask about past experiences, teamwork, leadership, conflict resolution, and problem-solving situations relevant to ${topic}.`;
        break;
      case 'technical':
        systemPrompt += ` Focus on technical questions specific to ${topic}. Ask about technical skills, problem-solving approaches, coding practices, tools, frameworks, and industry-specific technical knowledge.`;
        break;
      case 'situational':
        systemPrompt += ` Focus on situational questions. Present hypothetical scenarios related to ${topic} and ask how the candidate would handle them. Test their decision-making and critical thinking.`;
        break;
    }
    
    switch(difficulty) {
      case 'beginner':
        systemPrompt += ` Keep questions at entry-level difficulty. Focus on fundamental concepts, basic knowledge, and simple scenarios suitable for someone starting their career in ${topic}.`;
        break;
      case 'intermediate':
        systemPrompt += ` Ask mid-level professional questions. Include moderately complex scenarios, practical experience-based questions, and topics requiring solid understanding of ${topic}.`;
        break;
      case 'advanced':
        systemPrompt += ` Ask senior-level challenging questions. Include complex scenarios, advanced concepts, leadership situations, and deep technical or strategic knowledge of ${topic}.`;
        break;
    }
    
    systemPrompt += ` Ask one question at a time, keep your responses concise (2-3 sentences max), and maintain a professional tone. Limit the interview to 5-7 questions total. Tailor each question specifically to ${topic} and ${interviewType} interview style at ${difficulty} level.`;
    
    const systemMessage = {
      role: "system",
      content: systemPrompt
    };
    
    const initialMessages = [systemMessage];
    setMessages(initialMessages);
    
    localStorage.setItem('interview_messages', JSON.stringify(initialMessages));
    
    await sendMessageToAI(initialMessages, "Please start the interview with your first question.");
  };
  
  const sendMessageToAI = async (currentMessages, userInput = null) => {
    setIsProcessing(true);
    setIsAISpeaking(true);
    
    try {
      const messagesToSend = userInput ? 
        [...currentMessages, { role: "user", content: userInput }] : 
        currentMessages;
      
      const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3.1",
          messages: messagesToSend,
          max_tokens: 150,
          temperature: 0.7
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      const updatedMessages = [...messagesToSend, { role: "assistant", content: aiResponse }];
      setMessages(updatedMessages);
      setCurrentQuestion(aiResponse);
      
      localStorage.setItem('interview_messages', JSON.stringify(updatedMessages));
      
      if (userInput) {
        setQuestionCount(prev => prev + 1);
      }
      
      await speakText(aiResponse);
      
    } catch (error) {
      console.error("AI request failed:", error);
      const errorMessage = "I apologize, there was a technical issue. Please try again.";
      setCurrentQuestion(errorMessage);
      await speakText(errorMessage);
    } finally {
      setIsProcessing(false);
      setIsAISpeaking(false);
    }
  };
  
  const speakText = async (text) => {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2"
        })
      });
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        
        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = url;
          audioPlayerRef.current.play();
        }
      }
    } catch (error) {
      console.error("TTS failed:", error);
    }
  };
  
  const handleUserResponse = async (speechText) => {
    if (!speechText.trim()) return;
    
    console.log('User said:', speechText);
    
    if (questionCount >= 6) {
      const endMessage = "Thank you for completing the interview. We'll now analyze your responses and provide feedback.";
      setCurrentQuestion(endMessage);
      await speakText(endMessage);
      
      setTimeout(() => {
        // Save interview data before navigating
        sessionStorage.setItem('interviewCompleted', 'true');
        navigate('/interview-results');
      }, 3000);
      return;
    }
    
    await sendMessageToAI(messages, speechText);
  };
  
  const endInterview = async () => {
    const endMessage = "Interview ended. Thank you for your time. Redirecting to results...";
    setCurrentQuestion(endMessage);
    await speakText(endMessage);
    
    setTimeout(() => {
      sessionStorage.setItem('interviewCompleted', 'true');
      navigate('/interview-results');
    }, 2000);
  };
  
  const handleMicClick = () => {
    if (!interviewStarted) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else if (!isAISpeaking && !isProcessing) {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleMicMouseDown = () => {
    const timer = setTimeout(() => {
      // Long press detected - end interview
      endInterview();
    }, 2000); // 2 seconds long press
    setPressTimer(timer);
  };

  const handleMicMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
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

      <div style={{
        marginLeft: '280px',
        width: 'calc(100vw - 280px)',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        display: 'flex',
        flexDirection: 'column',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span>Elapsed Time: {formatTime(elapsedTime)}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1rem'
          }}>
            <ChatBubbleLogo size={32} />
            <span>{isAISpeaking ? 'AI Interviewer is speaking...' : 'Your turn to speak'}</span>
          </div>

          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            color: 'white'
          }}>
            <MoreVertical size={20} />
          </button>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          {!interviewStarted ? (
            <div style={{
              maxWidth: '500px',
              width: '100%'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '400',
                margin: 0,
                marginBottom: '2rem',
                color: 'white'
              }}>
                Select Your Interview Type
              </h2>
              
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  borderRadius: '8px',
                  border: '2px solid #06b6d4',
                  backgroundColor: 'white',
                  color: '#374151',
                  marginBottom: '2rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">Choose a profession...</option>
                {professions.map((profession) => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
              
              <button
                onClick={startInterview}
                disabled={!selectedProfession}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  backgroundColor: selectedProfession ? '#06b6d4' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: selectedProfession ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                Start {selectedProfession} Interview
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '3rem',
                height: '80px'
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((bar) => {
                  const baseHeight = 15;
                  const maxHeight = 60;
                  let currentHeight = baseHeight;
                  
                  if (isAISpeaking || isProcessing) {
                    currentHeight = baseHeight + Math.abs(Math.sin((Date.now() / 150) + bar * 0.5)) * (maxHeight - baseHeight);
                  } else if (isListening) {
                    currentHeight = baseHeight + Math.abs(Math.sin((Date.now() / 100) + bar * 0.3)) * ((maxHeight - baseHeight) * 0.7);
                  }
                  
                  return (
                    <div
                      key={bar}
                      style={{
                        width: '8px',
                        height: `${currentHeight}px`,
                        backgroundColor: isListening ? '#ef4444' : 
                                       (isAISpeaking || isProcessing) ? '#06b6d4' : 'rgba(255, 255, 255, 0.4)',
                        borderRadius: '4px',
                        transition: 'height 0.1s ease, background-color 0.3s ease',
                        boxShadow: (isAISpeaking || isListening) ? '0 0 10px rgba(6, 182, 212, 0.5)' : 'none'
                      }}
                    />
                  );
                })}
              </div>

              <div style={{
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '0.5rem'
                }}>
                  {isProcessing ? 'AI is thinking...' :
                   isAISpeaking ? 'AI is speaking...' :
                   isListening ? 'Listening to your response...' :
                   'Your turn to speak'}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  Question {questionCount} of 6 • {interviewConfig?.topic || 'Software Engineering'} • {interviewConfig?.interviewType || 'Behavioral'} • {interviewConfig?.difficulty || 'Intermediate'}
                </div>
              </div>

              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '400',
                margin: 0,
                marginBottom: '4rem',
                maxWidth: '700px',
                lineHeight: '1.4',
                color: 'white',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {currentQuestion || `Welcome to your ${selectedProfession} interview. Please wait while I prepare the first question...`}
              </h2>
            </>
          )}
        </div>

        {interviewStarted && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '2rem',
            borderRadius: '24px 24px 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button
              onClick={handleMicClick}
              onMouseDown={handleMicMouseDown}
              onMouseUp={handleMicMouseUp}
              onMouseLeave={handleMicMouseUp}
              onTouchStart={handleMicMouseDown}
              onTouchEnd={handleMicMouseUp}
              disabled={isAISpeaking || isProcessing}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: isListening ? '#ef4444' : 
                               (isAISpeaking || isProcessing) ? '#6b7280' : '#06b6d4',
                border: 'none',
                cursor: (isAISpeaking || isProcessing) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                transform: isListening ? 'scale(1.1)' : 'scale(1)',
                opacity: (isAISpeaking || isProcessing) ? 0.6 : 1
              }}
            >
              {isListening ? <MicOff size={40} color="white" /> : <Mic size={40} color="white" />}
            </button>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <p style={{
                color: '#6b7280',
                fontSize: '1rem',
                margin: 0,
                textAlign: 'center'
              }}>
                {isProcessing ? 'Processing your response...' :
                 isAISpeaking ? 'AI is speaking, please wait...' :
                 isListening ? 'Listening... Tap to stop recording' : 
                 'Tap the mic to respond'}
              </p>
              
              <button
                onClick={endInterview}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <StopCircle size={16} />
                End Interview
              </button>
            </div>
            
            <audio ref={audioPlayerRef} style={{ display: 'none' }} />
          </div>
        )}
      </div>


    </div>
  );
};

export default VoiceInterview;