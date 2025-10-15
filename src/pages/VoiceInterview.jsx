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
  
  // API Keys from environment variables
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

  //=================================================
  // I-LOAD ANG INTERVIEW CONFIGURATION
  // Kung mag start ang component, i-setup nato
  //=================================================
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
  
  //=================================================
  // TIMER EFFECT
  // Para track sa duration sa interview
  //=================================================
  useEffect(() => {
    let timer;
    if (interviewStarted) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [interviewStarted]);
  
  //=================================================
  // SPEECH RECOGNITION SETUP
  // Para maka recognize ta sa voice sa user
  //=================================================
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

  //=================================================
  // I-FORMAT ANG TIME
  // Convert into minutes ug seconds (MM:SS)
  //=================================================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  //=================================================
  // START SA INTERVIEW
  // Based sa profession nga gi pick sa user
  //=================================================
  const startInterview = async () => {
    if (!selectedProfession) return;
    
    setInterviewStarted(true);
    setQuestionCount(0);
    
    const focusType = interviewConfig?.focus || 'full';
    let systemPrompt = `You are a professional interviewer conducting a ${selectedProfession} interview.`;
    
    switch(focusType) {
      case 'behavioral':
        systemPrompt += ` Focus on behavioral questions using the STAR method. Ask about past experiences, teamwork, leadership, and problem-solving situations.`;
        break;
      case 'technical':
        systemPrompt += ` Focus on technical questions relevant to ${selectedProfession}. Ask about technical skills, problem-solving approaches, and industry-specific knowledge.`;
        break;
      case 'situational':
        systemPrompt += ` Focus on situational questions. Present hypothetical scenarios and ask how the candidate would handle them.`;
        break;
      default:
        systemPrompt += ` Conduct a comprehensive interview covering behavioral, technical, and situational questions.`;
    }
    
    systemPrompt += ` Ask one question at a time, keep responses concise (2-3 sentences max), and maintain a professional tone. Limit the interview to 5-7 questions total.`;
    
    const systemMessage = {
      role: "system",
      content: systemPrompt
    };
    
    const initialMessages = [systemMessage];
    setMessages(initialMessages);
    
    // Save messages to localStorage for persistence
    localStorage.setItem('interview_messages', JSON.stringify(initialMessages));
    
    // Get first question
    await sendMessageToAI(initialMessages, "Please start the interview with your first question.");
  };
  
  //=================================================
  // SEND MESSAGE SA AI
  // Para makadawat tag response gikan sa AI
  //=================================================
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
      
      // Save updated messages
      localStorage.setItem('interview_messages', JSON.stringify(updatedMessages));
      
      // Increment question count if this is a new question from AI
      if (userInput) {
        setQuestionCount(prev => prev + 1);
      }
      
      // Convert to speech
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
  
  // Convert text to speech
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
  
  // Handle user voice response
  const handleUserResponse = async (speechText) => {
    if (!speechText.trim()) return;
    
    console.log('User said:', speechText);
    
    // Check if interview should end (after 5-7 questions)
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
    
    // Send user response to AI for next question
    await sendMessageToAI(messages, speechText);
  };
  
  //=================================================
  // END INTERVIEW
  // Para mahuman ang interview kung gusto sa user
  //=================================================
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
      {/*==================================================
         * SIDEBAR SECTION
         * Nindot kaayo nga sidebar para sa navigation
         * Diri makita ang tanan links sa app
         *================================================*/}
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
        {/*=================================================
           * DARK OVERLAY
           * Para dili kaayo siga ang background image
           * Mas readable ang text ani
           *===============================================*/}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          zIndex: 1
        }}></div>
        
        {/*=================================================
           * SIDEBAR CONTENT CONTAINER
           * Main container sa tanan content sa sidebar
           * Para organized ang layout
           *===============================================*/}
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
              const isActive = item.id === 'live-interview'; // Live AI Interview is active
              
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

      {/*=================================================
         * MAIN INTERVIEW INTERFACE
         * Diri mahitabo ang voice interview
         * Naa diri ang timer ug AI interaction
         *===============================================*/}
      <div style={{
        marginLeft: '280px',
        width: 'calc(100vw - 280px)',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        display: 'flex',
        flexDirection: 'column',
        color: 'white'
      }}>
        {/*=================================================
           * HEADER SECTION
           * Naa diri ang timer ug status sa AI
           * Para mahibaw-an sa user ang progress
           *===============================================*/}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem',
          position: 'relative'
        }}>
          {/*=================================================
             * TIMER DISPLAY
             * Para makita pila na ka dugay ang interview
             * Format: MM:SS
             *===============================================*/}
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

          {/*=================================================
             * AI STATUS INDICATOR
             * Para makita kung nag process pa ang AI
             * Or ready na mo respond
             *===============================================*/}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1rem'
          }}>
            <ChatBubbleLogo size={32} />
            <span>{isAISpeaking ? 'AI Interviewer is speaking...' : 'Your turn to speak'}</span>
          </div>

          {/* Menu button */}
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

        {/*=================================================
           * INTERVIEW AREA
           * Main area para sa Q&A sa interview
           * Diri makita ang questions ug responses
           *===============================================*/}
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
            /* Profession Selection */
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
            /* Interview Interface */
            <>
              {/* Audio visualization with enhanced animation */}
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

              {/* Status indicator with question counter */}
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
                  Question {questionCount} of 6 • {selectedProfession} Interview
                </div>
              </div>

              {/* Question text */}
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

        {/* Bottom mic section */}
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
            {/* Mic button */}
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

            {/* Instructions and End Interview Button */}
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
            
            {/* Hidden audio player */}
            <audio ref={audioPlayerRef} style={{ display: 'none' }} />
          </div>
        )}
      </div>


    </div>
  );
};

export default VoiceInterview;