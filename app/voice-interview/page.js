'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mic, MicOff, Square } from 'lucide-react'

export default function VoiceInterview() {
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [conversation, setConversation] = useState([])
  const [interviewConfig, setInterviewConfig] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState([])
  const [isChatMode, setIsChatMode] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [isInterviewEnding, setIsInterviewEnding] = useState(false)
  const recognitionRef = useRef(null)
  const currentAudioRef = useRef(null)
  const hasStartedRef = useRef(false)
  


  useEffect(() => {
    const config = sessionStorage.getItem('interviewConfig')
    if (config) {
      setInterviewConfig(JSON.parse(config))
    }

    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      
      recognitionRef.current.onresult = (event) => {
        if (isProcessing || isAISpeaking) return
        
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        
        if (event.results[event.results.length - 1].isFinal) {
          recognitionRef.current.stop()
          setIsProcessing(true)
          setIsListening(false)
          handleUserResponse(transcript)
        }
      }
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started')
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setIsProcessing(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      const systemPrompt = `You are a PROFESSIONAL JOB INTERVIEWER conducting an interview. CRITICAL RULES:

1. YOU ARE THE INTERVIEWER - The candidate is being interviewed BY YOU
2. NEVER introduce yourself or talk about your own experience
3. ONLY ask follow-up questions based on the candidate's responses
4. Keep responses under 40 words
5. Stay in character as an HR interviewer at all times
6. Remember previous answers and build upon them
7. If the candidate says they are CEO of a company, ask relevant follow-up questions about their leadership experience

Example responses:
"Thank you Nathaniel. As CEO of Meta, what's been your biggest leadership challenge?"
"That's impressive. How do you handle making difficult decisions as a CEO?"
"Interesting. What leadership style do you find most effective?"`
      
      setMessages([{ role: "system", content: systemPrompt }])
      
      setTimeout(() => {
        startInterview()
      }, 1000)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startInterview = () => {
    const greeting = `Hello! Welcome to your ${interviewConfig?.type || 'behavioral'} interview. I'm your AI interviewer today. Let's begin with our first question. Tell me about yourself and why you're interested in this position.`
    
    const initialConversation = [{ type: 'ai', text: greeting }]
    setConversation(initialConversation)
    setMessages(prev => [...prev, { role: "assistant", content: greeting }])
    
    localStorage.setItem('interview_conversation', JSON.stringify(initialConversation))
    
    speakText(greeting)
  }

  const speakText = async (text, isFinalQuestion = false) => {
    if (isAISpeaking) return
    
    setIsAISpeaking(true)
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    
    try {
      const response = await fetch('/api/interviews/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) throw new Error("TTS request failed")
      const arrayBuffer = await response.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      
      const audio = new Audio(url)
      currentAudioRef.current = audio
      
      audio.onended = () => {
        setIsAISpeaking(false)
        currentAudioRef.current = null
        
        if (isFinalQuestion) {
          console.log('Final question audio finished, waiting 10 more seconds before routing...')
          setTimeout(() => {
            console.log('Routing to interview results...')
            router.push('/interview-results')
          }, 10000) // 10 second delay
        } else {
          // Normal behavior - start listening again
          setTimeout(() => {
            if (!isProcessing) {
              startListening()
            }
          }, 500)
        }
      }
      
      audio.onerror = () => {
        setIsAISpeaking(false)
        currentAudioRef.current = null
        
        if (isFinalQuestion) {
          console.log('Audio error on final question, waiting 10 seconds before routing...')
          setTimeout(() => {
            router.push('/interview-results')
          }, 10000)
        }
      }
      
      audio.play()
    } catch (err) {
      console.error("TTS failed:", err)
      setIsAISpeaking(false)
      currentAudioRef.current = null
      
      if (isFinalQuestion) {
        console.log('TTS failed on final question, waiting 10 seconds before routing...')
        setTimeout(() => {
          router.push('/interview-results')
        }, 10000)
      }
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing && !isAISpeaking) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleUserResponse = (transcript) => {
    if (transcript.trim()) {
      const newConversation = [...conversation, { type: 'user', text: transcript }]
      setConversation(newConversation)
      
      const updatedMessages = [...messages, { role: "user", content: transcript }]
      setMessages(updatedMessages)
      
      localStorage.setItem('interview_conversation', JSON.stringify(newConversation))
      
      setTimeout(() => {
        generateAIResponse(transcript, updatedMessages)
      }, 500)
    } else {
      setIsProcessing(false)
    }
  }

  const generateAIResponse = async (userResponse, currentMessages = messages) => {
    try {
      console.log('=== Generating AI Response ===')
      console.log('User said:', userResponse)
      console.log('Current question:', currentQuestion)
      console.log('Sending messages:', currentMessages)
      
      const isRequestingClosing = currentQuestion >= 6
      
      const requestBody = { 
        messages: currentMessages,
        isClosingStatement: isRequestingClosing
      }
      
      console.log('Request body:', requestBody)
      
      const response = await fetch('/api/interviews/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status, response.ok)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Response data:', data)
      
      if (!data.response) {
        throw new Error('No response received')
      }
      
      const aiResponse = data.response
      console.log('AI will say:', aiResponse)
      
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }])
      const newConversation = [...conversation, { type: 'user', text: userResponse }, { type: 'ai', text: aiResponse }]
      setConversation(newConversation)
      
      localStorage.setItem('interview_conversation', JSON.stringify(newConversation))
      
      speakText(aiResponse, currentQuestion >= 6)
      
      if (currentQuestion < 6) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        setIsInterviewEnding(true)
        console.log('Final question reached - waiting for audio to finish before routing')
      }
      
    } catch (err) {
      console.error("AI Response Generation Failed:", err)
      
      if (currentQuestion >= 6) {
        const userMessages = messages.filter(m => m.role === 'user')
        const firstMessage = userMessages[0]?.content?.toLowerCase() || ""
        
        let userName = ""
        const nameMatch = firstMessage.match(/i'm\s+(\w+)|i am\s+(\w+)|my name is\s+(\w+)/i)
        if (nameMatch) {
          userName = (nameMatch[1] || nameMatch[2] || nameMatch[3]).charAt(0).toUpperCase() + 
                    (nameMatch[1] || nameMatch[2] || nameMatch[3]).slice(1).toLowerCase()
        }
        
        const closingResponse = userName 
          ? `Thank you so much, ${userName}! That concludes our interview. Let me analyze our conversation and prepare your results. You did wonderfully!`
          : "Thank you so much! That concludes our interview. Let me analyze our conversation and prepare your results. You did wonderfully!"
        
        setMessages(prev => [...prev, { role: "assistant", content: closingResponse }])
        const newConversation = [...conversation, { type: 'user', text: userResponse }, { type: 'ai', text: closingResponse }]
        setConversation(newConversation)
        
        localStorage.setItem('interview_conversation', JSON.stringify(newConversation))
        speakText(closingResponse, true) // Final question flag
        
        setIsInterviewEnding(true)
        console.log('Final question fallback - waiting for audio to finish')
      } else {
        const simpleResponse = "I see. What else would you like to share?"
        
        setMessages(prev => [...prev, { role: "assistant", content: simpleResponse }])
        const newConversation = [...conversation, { type: 'user', text: userResponse }, { type: 'ai', text: simpleResponse }]
        setConversation(newConversation)
        
        localStorage.setItem('interview_conversation', JSON.stringify(newConversation))
        speakText(simpleResponse, false)
        
        setCurrentQuestion(prev => prev + 1)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const endInterview = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    setIsProcessing(false)
    router.push('/interview-results')
  }

  // Sound wave visualization
  const SoundWave = () => {
    const bars = Array.from({ length: 9 }, (_, i) => i)
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '60px' }}>
        {bars.map((bar) => (
          <div
            key={bar}
            style={{
              width: '6px',
              backgroundColor: isListening ? '#ef4444' : isAISpeaking ? '#06b6d4' : '#d1d5db',
              borderRadius: '3px',
              height: isListening || isAISpeaking ? `${20 + Math.random() * 40}px` : '20px',
              animation: isListening || isAISpeaking ? `wave 0.5s ease-in-out infinite alternate` : 'none',
              animationDelay: `${bar * 0.1}s`,
              transition: 'all 0.3s ease',
              boxShadow: isListening || isAISpeaking ? '0 0 10px rgba(6, 182, 212, 0.3)' : 'none'
            }}
          />
        ))}
        <style jsx>{`
          @keyframes wave {
            0% { transform: scaleY(0.5); }
            100% { transform: scaleY(1.5); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => router.push('/live-ai-interview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#374151'
              }}
            >
              <ArrowLeft size={16} />
              Back to Setup
            </button>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              AI Interview Session
            </h1>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {isInterviewEnding ? 'Interview Completed - Preparing Results...' : `Question ${currentQuestion} of 6`}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Interview Title */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            {interviewConfig?.type ? 
              (interviewConfig.type.charAt(0).toUpperCase() + interviewConfig.type.slice(1) + ' Interview') : 
              'AI Interview'
            }
          </h2>
        </div>

        {/* Sound Wave Visualization */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SoundWave />
        </div>

        {/* Status Text */}
        <div style={{ fontSize: '1.125rem', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {isAISpeaking ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#06b6d4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span style={{ color: '#06b6d4' }}>AI is speaking...</span>
            </>
          ) : isListening ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23" stroke="#ef4444" strokeWidth="2"/>
                <line x1="8" y1="23" x2="16" y2="23" stroke="#ef4444" strokeWidth="2"/>
              </svg>
              <span style={{ color: '#ef4444' }}>Listening to your response...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#10b981">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span style={{ color: '#10b981' }}>Ready for next interaction</span>
            </>
          )}
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '4px'
          }}>
            <button
              onClick={() => setIsChatMode(false)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: !isChatMode ? '#06b6d4' : 'transparent',
                color: !isChatMode ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Voice Mode
            </button>
            <button
              onClick={() => setIsChatMode(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isChatMode ? '#06b6d4' : 'transparent',
                color: isChatMode ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Chat Mode
            </button>
          </div>
        </div>

        {/* Chat Input (when in chat mode) */}
        {isChatMode && (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isProcessing && textInput.trim()) {
                    handleUserResponse(textInput.trim())
                    setTextInput('')
                  }
                }}
                placeholder="Type your response..."
                disabled={isProcessing || isAISpeaking}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => {
                  if (textInput.trim() && !isProcessing) {
                    handleUserResponse(textInput.trim())
                    setTextInput('')
                  }
                }}
                disabled={isProcessing || isAISpeaking || !textInput.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  opacity: (isProcessing || isAISpeaking || !textInput.trim()) ? 0.5 : 1
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Voice Controls (when in voice mode) */}
        {!isChatMode && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isAISpeaking}
              style={{
                padding: '1rem 2rem',
                backgroundColor: isListening ? '#ef4444' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isAISpeaking ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isAISpeaking ? 0.5 : 1,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              {isListening ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        )}

        {/* End Interview Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={endInterview}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Square size={20} />
            End Interview
          </button>
        </div>

        {/* Conversation History */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem', textAlign: 'center' }}>
            Conversation
          </h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {conversation.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: message.type === 'ai' ? '#f0f9ff' : '#f0fdf4',
                  border: message.type === 'ai' ? '1px solid #e0f2fe' : '1px solid #dcfce7'
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {message.type === 'ai' ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#06b6d4">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span>AI Interviewer</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>You</span>
                    </>
                  )}
                </div>
                <div style={{ color: '#111827' }}>{message.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}