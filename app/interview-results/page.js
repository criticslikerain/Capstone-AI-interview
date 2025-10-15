'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, BarChart3, TrendingUp, Award, AlertCircle, Volume2, VolumeX } from 'lucide-react'

export default function InterviewResults() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [conversation, setConversation] = useState([])
  const [isPlayingSummary, setIsPlayingSummary] = useState(false)
  const [summaryGenerated, setSummaryGenerated] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    analyzeInterview()
  }, [])






  const analyzeInterview = async () => {
    try {
      const storedConversation = JSON.parse(localStorage.getItem('interview_conversation') || '[]')
      setConversation(storedConversation)
      const response = await fetch('/api/interviews/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: storedConversation })
      })
      const data = await response.json()
      setAnalysis(data.analysis)
      setTimeout(() => {
        generateVoiceSummary(data.analysis, storedConversation)
      }, 1500)
      
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }










  const generateVoiceSummary = async (analysisData, conversationData) => {
    try {
      console.log('Preparing voice summary...')
      const userMessages = conversationData.filter(msg => msg.type === 'user')
      let userName = ""
      if (userMessages.length > 0) {
        const firstMessage = userMessages[0].text.toLowerCase()
        const nameMatch = firstMessage.match(/i'm\s+(\w+)|i am\s+(\w+)|my name is\s+(\w+)/i)
        if (nameMatch) {
          userName = (nameMatch[1] || nameMatch[2] || nameMatch[3]).charAt(0).toUpperCase() + 
                    (nameMatch[1] || nameMatch[2] || nameMatch[3]).slice(1).toLowerCase()
        }
      }

      const summary = generateSummaryText(analysisData, userName)
      const response = await fetch('/api/interviews/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary })
      })

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" })
        const url = URL.createObjectURL(blob)
        
        const audio = new Audio(url)
        audioRef.current = audio
        
        audio.onplay = () => setIsPlayingSummary(true)
        audio.onended = () => setIsPlayingSummary(false)
        audio.onerror = () => setIsPlayingSummary(false)
        
        setSummaryGenerated(true)
        console.log('Voice summary prepared and ready to play')
      }
    } catch (error) {
      console.error('Voice summary preparation failed:', error)
      setSummaryGenerated(false)
    }
  }




  const generateSummaryText = (analysisData, userName) => {
    const namePrefix = userName ? `${userName}, ` : ""
    const score = analysisData?.overallScore || 75
    
    let scoreComment = ""
    if (score >= 85) {
      scoreComment = "excellent performance"
    } else if (score >= 75) {
      scoreComment = "strong performance"
    } else if (score >= 65) {
      scoreComment = "solid performance with room for improvement"
    } else {
      scoreComment = "performance that shows potential with several areas to develop"
    }

    const strengths = analysisData?.strengths || [
      "Clear communication",
      "Professional demeanor",
      "Relevant experience"
    ]

    const improvements = analysisData?.improvements || [
      "Provide more specific examples",
      "Elaborate on technical skills",
      "Show more enthusiasm"
    ]

    const summary = `${namePrefix}thank you for completing the interview. Based on our conversation, I've given you a score of ${score} out of 100, reflecting ${scoreComment}. 

Your key strengths include ${strengths.slice(0, 2).join(' and ')}, which clearly demonstrate your capabilities. 

For areas of improvement, I recommend focusing on ${improvements.slice(0, 2).join(' and ')}. These enhancements will significantly strengthen your interview performance.

Overall, you showed good potential and with some targeted practice on the mentioned areas, you'll be well-prepared for future interviews. You can review the detailed analysis below for specific recommendations.`

    return summary
  }

  const toggleSummaryAudio = async () => {
    if (audioRef.current) {
      if (isPlayingSummary) {
        audioRef.current.pause()
        setIsPlayingSummary(false)
      } else {
        audioRef.current.play()
        setIsPlayingSummary(true)
      }
    } else if (analysis && conversation.length > 0) {
      await generateVoiceSummary(analysis, conversation)
      if (audioRef.current) {
        audioRef.current.play()
      }
    }
  }

  const downloadAudio = async () => {
    try {
      const response = await fetch('/api/interviews/download-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation })
      })
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `interview-${Date.now()}.mp3`
      a.click()
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f9fafb',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          {/* Main Spinner */}
          <div style={{
            width: '80px',
            height: '80px',
            border: '8px solid #e5e7eb',
            borderTop: '8px solid #06b6d4',
            borderRadius: '50%',
            margin: '0 auto 2rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          
          {/* Analysis Icon */}
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#06b6d4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M9 11H7v8h2v-8zm4-4h-2v12h2V7zm4-2h-2v14h2V5z"/>
              <path d="M5 3v18h14V3H5zm12 16H7V5h10v14z"/>
            </svg>
          </div>
          
          {/* Loading Text */}
          <p style={{ 
            marginTop: '1rem', 
            color: '#374151',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            AI analyzing your interview...
          </p>
          
          {/* Progress Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1.5rem'
          }}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <div key={i} style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#06b6d4',
                borderRadius: '50%',
                animation: `bounce 2s infinite ${delay}s`
              }}></div>
            ))}
          </div>
          
          {/* Status Text */}
          <p style={{
            marginTop: '1.5rem',
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Processing your responses and generating insights...
          </p>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => router.push('/user-dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', backgroundColor: 'transparent',
              border: '1px solid #d1d5db', borderRadius: '8px',
              cursor: 'pointer', color: '#374151'
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Interview Results
          </h1>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Overall Score */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '120px', height: '120px', margin: '0 auto 1rem',
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
              <circle 
                cx="60" cy="60" r="50" fill="none" stroke="#06b6d4" strokeWidth="8"
                strokeDasharray={`${(analysis?.overallScore || 75) * 3.14} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute', fontSize: '2rem', fontWeight: 'bold', color: '#111827'
            }}>
              {analysis?.overallScore || 75}%
            </div>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Overall Performance
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            {analysis?.overallFeedback || "Good performance with room for improvement"}
          </p>
          
          {/* Voice Summary Control */}
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={toggleSummaryAudio}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: isPlayingSummary ? '#ef4444' : '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: summaryGenerated || analysis ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 auto',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                opacity: summaryGenerated || analysis ? 1 : 0.6
              }}
              disabled={!summaryGenerated && !analysis}
            >
              {isPlayingSummary ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isPlayingSummary ? 'Stop Voice Summary' : 'Play Voice Summary'}
            </button>
            {summaryGenerated && (
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                marginTop: '0.5rem',
                fontStyle: 'italic' 
              }}>
                {isPlayingSummary ? 'Playing personalized results summary...' : 'Click to hear your personalized results summary'}
              </p>
            )}
          </div>
        </div>

        {/* Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', textAlign: 'center'
          }}>
            <BarChart3 size={32} color="#06b6d4" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
              {analysis?.communicationScore || 78}%
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Communication</p>
          </div>

          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', textAlign: 'center'
          }}>
            <TrendingUp size={32} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
              {analysis?.confidenceScore || 82}%
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Confidence</p>
          </div>

          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', textAlign: 'center'
          }}>
            <Award size={32} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
              {analysis?.relevanceScore || 85}%
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Relevance</p>
          </div>
        </div>

        {/* Analysis & Improvements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Strengths */}
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981', marginBottom: '1rem' }}>
              Strengths
            </h3>
            {(analysis?.strengths || [
              "Clear communication style",
              "Good examples provided",
              "Professional demeanor"
            ]).map((strength, index) => (
              <div key={index} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '0.75rem', color: '#374151'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{strength}</span>
              </div>
            ))}
          </div>

          {/* Areas for Improvement */}
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '1rem' }}>
              Areas for Improvement
            </h3>
            {(analysis?.improvements || [
              "Provide more specific examples",
              "Elaborate on technical skills",
              "Show more enthusiasm"
            ]).map((improvement, index) => (
              <div key={index} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '0.75rem', color: '#374151'
              }}>
                <AlertCircle size={16} color="#f59e0b" />
                <span>{improvement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Analysis */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Detailed Analysis
          </h3>
          <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
            {analysis?.detailedAnalysis || "Your interview performance shows good potential with several areas of strength. You demonstrated clear communication skills and provided relevant examples when discussing your experience. To improve further, consider providing more specific details and quantifiable results in your responses."}
          </p>
          
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
            Recommendations:
          </h4>
          <ul style={{ color: '#374151', paddingLeft: '1.5rem' }}>
            {(analysis?.recommendations || [
              "Practice the STAR method (Situation, Task, Action, Result) for behavioral questions",
              "Prepare specific examples that demonstrate your key skills",
              "Research the company and role more thoroughly",
              "Work on projecting confidence through body language and tone"
            ]).map((rec, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={downloadAudio}
            style={{
              padding: '1rem 2rem', backgroundColor: '#06b6d4', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
            }}
          >
            <Download size={20} />
            Download Interview Audio
          </button>
          
          <button
            onClick={() => router.push('/live-ai-interview')}
            style={{
              padding: '1rem 2rem', backgroundColor: '#10b981', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            Practice Again
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================== 
    PAGES SHITS  

*/ 