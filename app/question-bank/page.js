'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  HelpCircle,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Loader,
  FileText,
  Download
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { auth, db } from '../../lib/firebase'
import { collection, addDoc, updateDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { canAnswerQuestion, incrementQuestionCount } from '../../lib/subscriptionLimits'

export default function QuestionBank() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submittedAnswers, setSubmittedAnswers] = useState({})
  const [analyzingAnswers, setAnalyzingAnswers] = useState({})
  const [aiAnalysis, setAiAnalysis] = useState({})
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [batchIds, setBatchIds] = useState({})
  const [user, setUser] = useState(null)
  const [apiQuestions, setApiQuestions] = useState({})
  const [loadingApiQuestions, setLoadingApiQuestions] = useState({})
  const [usageInfo, setUsageInfo] = useState(null)
  const [showLimitModal, setShowLimitModal] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        loadUserAnswers(currentUser.uid)
        loadUserApiQuestions(currentUser.uid)
        checkUsage(currentUser.uid)
      }
    })
    return () => unsubscribe()
  }, [])

  const checkUsage = async (userId) => {
    const usage = await canAnswerQuestion(userId)
    setUsageInfo(usage)
  }

  const loadUserAnswers = async (userId) => {
    try {
      const answersRef = collection(db, 'question_answers')
      const q = query(answersRef, where('user_id', '==', userId))
      const snapshot = await getDocs(q)
      
      const loadedAnswers = {}
      const loadedSubmitted = {}
      const loadedAnalysis = {}
      const loadedBatchIds = {}
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        const key = `${data.category_id}_${data.question_index}`
        loadedAnswers[key] = data.answer
        loadedSubmitted[key] = true
        if (data.ai_analysis) {
          loadedAnalysis[key] = data.ai_analysis
        }
        if (data.batch_id) {
          loadedBatchIds[data.category_id] = data.batch_id
        }
      })
      
      setAnswers(loadedAnswers)
      setSubmittedAnswers(loadedSubmitted)
      setAiAnalysis(loadedAnalysis)
      setBatchIds(loadedBatchIds)
    } catch (error) {
      console.error('Error loading answers:', error)
    }
  }

  const loadUserApiQuestions = async (userId) => {
    try {
      const questionsRef = collection(db, 'user_api_questions')
      const q = query(questionsRef, where('user_id', '==', userId))
      const snapshot = await getDocs(q)
      
      const loadedApiQuestions = {}
      snapshot.forEach((doc) => {
        const data = doc.data()
        if (!loadedApiQuestions[data.category_id]) {
          loadedApiQuestions[data.category_id] = []
        }
        loadedApiQuestions[data.category_id].push(data.question)
      })
      
      setApiQuestions(loadedApiQuestions)
    } catch (error) {
      console.error('Error loading API questions:', error)
    }
  }

  const fetchMoreQuestions = async (categoryId) => {
    if (!user) return
    
    setLoadingApiQuestions(prev => ({ ...prev, [categoryId]: true }))
    
    try {
      const apiEndpoints = {
        behavioral: 'https://behavioral-question-api.netlify.app/.netlify/functions/behavioral-questions',
        technical: 'https://behavioral-question-api.netlify.app/.netlify/functions/technical-questions',
        'problem-solving': 'https://behavioral-question-api.netlify.app/.netlify/functions/problem-solving-questions'
      }
      
      const response = await fetch(apiEndpoints[categoryId])
      if (!response.ok) throw new Error('Failed to fetch questions')
      
      const data = await response.json()
      const newQuestions = data.questions.slice(0, 5)
      
      // Save to Firebase
      const questionsRef = collection(db, 'user_api_questions')
      for (const question of newQuestions) {
        await addDoc(questionsRef, {
          user_id: user.uid,
          category_id: categoryId,
          question: question,
          created_at: new Date()
        })
      }
      
      setApiQuestions(prev => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), ...newQuestions]
      }))
    } catch (error) {
      console.error('Error fetching more questions:', error)
      alert('Unable to load more questions. Please try again later.')
    } finally {
      setLoadingApiQuestions(prev => ({ ...prev, [categoryId]: false }))
    }
  }

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
      count: '5 Questions',
      questions: [
        'Tell me about a time when you had to work under pressure.',
        'Describe a situation where you had to resolve a conflict with a team member.',
        'Give an example of a goal you set and how you achieved it.',
        'Tell me about a time you failed and what you learned from it.',
        'Describe a situation where you had to adapt to significant changes.'
      ]
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
      count: '5 Questions',
      questions: [
        'Explain the difference between SQL and NoSQL databases.',
        'What is the difference between REST and GraphQL APIs?',
        'How would you optimize a slow-performing database query?',
        'Explain the concept of microservices architecture.',
        'What are the key principles of object-oriented programming?'
      ]
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
      count: '5 Questions',
      questions: [
        'How would you approach debugging a complex issue in production?',
        'Design a system to handle 1 million concurrent users.',
        'How would you prioritize features when resources are limited?',
        'Explain your approach to solving a problem you\'ve never encountered before.',
        'How would you design a URL shortening service like bit.ly?'
      ]
    }
  ]

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const handleAnswerChange = async (categoryId, questionIndex, value) => {
    const key = `${categoryId}_${questionIndex}`
    setAnswers(prev => ({ ...prev, [key]: value }))
    
    // Auto-save to Firebase (partial answer)
    if (user && value.trim().length > 10) {
      try {
        const answersRef = collection(db, 'question_answers')
        const q = query(
          answersRef,
          where('user_id', '==', user.uid),
          where('category_id', '==', categoryId),
          where('question_index', '==', questionIndex)
        )
        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
          const docRef = doc(db, 'question_answers', snapshot.docs[0].id)
          await updateDoc(docRef, {
            answer: value,
            updated_at: serverTimestamp()
          })
        }
      } catch (error) {
        console.error('Auto-save error:', error)
      }
    }
  }

  const analyzeWithAI = async (question, answer) => {
    try {
      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-V3.1',
          messages: [
            { role: 'system', content: 'You are an expert interview coach. Provide constructive feedback with a score out of 10.' },
            { role: 'user', content: `Analyze this interview answer:\n\nQuestion: ${question}\n\nAnswer: ${answer}\n\nProvide:\n1. Score: X/10\n2. Strengths\n3. Areas for improvement\n4. Specific recommendations` }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      const result = await response.json()
      const analysis = result.choices?.[0]?.message?.content || 'Analysis completed. Your answer shows good understanding.'
      
      const scoreMatch = analysis.match(/Score:\s*(\d+)\s*\/\s*10/i) || analysis.match(/(\d+)\s*\/\s*10/)
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 5
      
      return { analysis, score }
    } catch (error) {
      console.error('AI Analysis error:', error)
      return { analysis: 'AI analysis is temporarily unavailable. Your answer has been saved.', score: 5 }
    }
  }

  const handleSubmitAnswer = async (categoryId, questionIndex, question) => {
    if (!user) {
      alert('Please log in to submit answers')
      return
    }

    const key = `${categoryId}_${questionIndex}`
    const answer = answers[key]

    if (!answer || answer.trim().length < 10) {
      alert('Please provide a more detailed answer (at least 10 characters)')
      return
    }

    if (submittedAnswers[key]) {
      setAnalyzingAnswers(prev => ({ ...prev, [key]: true }))
    } else {
      // Check usage limit for new submissions
      const canAnswer = await canAnswerQuestion(user.uid)
      if (!canAnswer.allowed) {
        setShowLimitModal(true)
        return
      }
      setAnalyzingAnswers(prev => ({ ...prev, [key]: true }))
      await incrementQuestionCount(user.uid)
      await checkUsage(user.uid)
    }

    try {
      // Generate or get batch ID
      let batchId = batchIds[categoryId]
      if (!batchId) {
        batchId = `${user.uid}_${categoryId}_${Date.now()}`
        setBatchIds(prev => ({ ...prev, [categoryId]: batchId }))
      }

      // Get AI analysis
      const { analysis, score } = await analyzeWithAI(question, answer)

      // Save to Firebase
      const answersRef = collection(db, 'question_answers')
      const q = query(
        answersRef,
        where('user_id', '==', user.uid),
        where('category_id', '==', categoryId),
        where('question_index', '==', questionIndex)
      )
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        await addDoc(answersRef, {
          user_id: user.uid,
          category_id: categoryId,
          question_index: questionIndex,
          question: question,
          answer: answer,
          ai_analysis: analysis,
          score: score,
          batch_id: batchId,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        })
      } else {
        const docRef = doc(db, 'question_answers', snapshot.docs[0].id)
        await updateDoc(docRef, {
          answer: answer,
          ai_analysis: analysis,
          score: score,
          batch_id: batchId,
          updated_at: serverTimestamp()
        })
      }

      setSubmittedAnswers(prev => ({ ...prev, [key]: true }))
      setAiAnalysis(prev => ({ ...prev, [key]: analysis }))
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to submit answer. Please try again.')
    } finally {
      setAnalyzingAnswers(prev => ({ ...prev, [key]: false }))
    }
  }

  const viewAnalysis = (categoryId, questionIndex, question) => {
    const key = `${categoryId}_${questionIndex}`
    setCurrentAnalysis({
      question,
      answer: answers[key],
      analysis: aiAnalysis[key],
      categoryId,
      questionIndex
    })
    setShowAnalysisModal(true)
  }

  const generateCategorySummary = async (categoryId) => {
    const category = questionCategories.find(c => c.id === categoryId)
    if (!category) return

    const allQA = category.questions.map((q, idx) => {
      const key = `${categoryId}_${idx}`
      return {
        question: q,
        answer: answers[key] || '',
        analysis: aiAnalysis[key] || ''
      }
    }).filter(qa => qa.answer.trim())

    if (allQA.length === 0) return

    try {
      const summaryPrompt = `Analyze all ${allQA.length} interview answers from the ${category.title} category and provide a comprehensive summary:\n\n${allQA.map((qa, i) => `Question ${i + 1}: ${qa.question}\nAnswer: ${qa.answer}\n`).join('\n')}\n\nProvide:\n1. Overall Score: X/10\n2. Key Strengths across all answers\n3. Common areas for improvement\n4. Specific recommendations for this category`

      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-V3.1',
          messages: [
            { role: 'system', content: 'You are an expert interview coach providing comprehensive feedback on multiple interview answers.' },
            { role: 'user', content: summaryPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      const result = await response.json()
      const summary = result.choices?.[0]?.message?.content || 'Summary generated successfully.'

      setCurrentAnalysis({
        question: `${category.title} - Complete Analysis`,
        answer: `Analyzed ${allQA.length} questions from this category`,
        analysis: summary,
        allAnswers: allQA,
        isSummary: true
      })
      setShowAnalysisModal(true)
    } catch (error) {
      console.error('Summary generation error:', error)
      alert('Failed to generate category summary. Please try again.')
    }
  }

  const exportToPDF = async () => {
    if (typeof window === 'undefined') return
    
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      let yPosition = margin

      // Logo
      doc.setFillColor(6, 182, 212)
      doc.circle(pageWidth - 25, 15, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text('IP', pageWidth - 28, 18)
      doc.setTextColor(0, 0, 0)

      // Title
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('InterviewPro', margin, yPosition)
      yPosition += 8
      doc.setFontSize(16)
      doc.text(currentAnalysis.isSummary ? 'Category Summary Report' : 'AI Analysis Report', margin, yPosition)
      yPosition += 12

      // Divider
      doc.setDrawColor(6, 182, 212)
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 10

      // Date
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(128, 128, 128)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition)
      yPosition += 15
      doc.setTextColor(0, 0, 0)

      // If summary with all answers
      if (currentAnalysis.isSummary && currentAnalysis.allAnswers) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(currentAnalysis.question, margin, yPosition)
        yPosition += 10

        currentAnalysis.allAnswers.forEach((qa, idx) => {
          if (yPosition > pageHeight - 50) {
            doc.addPage()
            yPosition = margin
          }
          
          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.text(`Question ${idx + 1}:`, margin, yPosition)
          yPosition += 6
          
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          const qLines = doc.splitTextToSize(qa.question, pageWidth - 2 * margin)
          doc.text(qLines, margin, yPosition)
          yPosition += qLines.length * 4 + 4
          
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(10)
          doc.text('Your Answer:', margin, yPosition)
          yPosition += 5
          
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          const aLines = doc.splitTextToSize(qa.answer, pageWidth - 2 * margin)
          doc.text(aLines, margin, yPosition)
          yPosition += aLines.length * 4 + 8
        })
        
        if (yPosition > pageHeight - 60) {
          doc.addPage()
          yPosition = margin
        }
        yPosition += 5
      } else {
        // Single question
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Question:', margin, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        const questionLines = doc.splitTextToSize(currentAnalysis.question, pageWidth - 2 * margin)
        doc.text(questionLines, margin, yPosition)
        yPosition += questionLines.length * 5 + 10

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.text('Your Answer:', margin, yPosition)
        yPosition += 7
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        const answerLines = doc.splitTextToSize(currentAnalysis.answer, pageWidth - 2 * margin)
        doc.text(answerLines, margin, yPosition)
        yPosition += answerLines.length * 5 + 10

        if (yPosition > pageHeight - 60) {
          doc.addPage()
          yPosition = margin
        }
      }

      // AI Analysis
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('AI Analysis:', margin, yPosition)
      yPosition += 10
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      const analysisLines = doc.splitTextToSize(currentAnalysis.analysis, pageWidth - 2 * margin)
      
      for (let i = 0; i < analysisLines.length; i++) {
        if (yPosition > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(analysisLines[i], margin, yPosition)
        yPosition += 5
      }

      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text('InterviewPro - AI Interview Practice Platform', pageWidth / 2, pageHeight - 10, { align: 'center' })

      doc.save(`InterviewPro-Analysis-${Date.now()}.pdf`)
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  const getCategoryProgress = (categoryId) => {
    const category = questionCategories.find(c => c.id === categoryId)
    if (!category) return 0
    
    const totalQuestions = category.questions.length
    const answeredCount = category.questions.filter((_, idx) => {
      const key = `${categoryId}_${idx}`
      return submittedAnswers[key]
    }).length
    
    return answeredCount
  }

  return (
    <>
      <style jsx global>{`
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
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        textarea {
          font-family: inherit;
        }
      `}</style>
      
      <div style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden'
      }}>
        <Sidebar activeItem="question-bank" />

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
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
            position: 'relative',
            paddingTop: '3rem',
            paddingBottom: '4rem',
            color: 'white',
            textAlign: 'center'
          }}>
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
              <div style={{ flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                  <circle cx="35" cy="35" r="25" fill="#fbbf24"/>
                  <text x="35" y="45" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">?</text>
                  <ellipse cx="65" cy="25" rx="18" ry="12" fill="#06b6d4"/>
                  <ellipse cx="70" cy="45" rx="15" ry="10" fill="#8b5cf6"/>
                  <ellipse cx="60" cy="65" rx="12" ry="8" fill="#ef4444"/>
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

          <div style={{
            width: '100%',
            margin: '0 auto',
            padding: '0.5rem',
            marginTop: '2rem',
            position: 'relative',
            zIndex: 3
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
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
                  <HelpCircle size={18} color="#06b6d4" />
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
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {questionCategories.filter(category => {
                  if (!searchQuery.trim()) return true
                  const query = searchQuery.toLowerCase()
                  return category.title.toLowerCase().includes(query) ||
                         category.description.toLowerCase().includes(query) ||
                         category.questions.some(q => q.toLowerCase().includes(query))
                }).map((category) => {
                  const isExpanded = expandedCategory === category.id
                  const progress = getCategoryProgress(category.id)
                  
                  return (
                    <div
                      key={category.id}
                      style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.3s'
                      }}
                    >
                      <div
                        onClick={() => toggleCategory(category.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: isExpanded ? '#e0f2fe' : '#f8fafc'
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded) {
                            e.currentTarget.style.backgroundColor = '#f1f5f9'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded) {
                            e.currentTarget.style.backgroundColor = '#f8fafc'
                          }
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
                            {progress > 0 && (
                              <div style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                backgroundColor: '#10b981',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid white'
                              }}>
                                <CheckCircle size={12} color="white" />
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
                              {category.description} {progress > 0 && `• ${progress}/${category.questions.length} answered`}
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
                          {isExpanded ? (
                            <ChevronDown size={20} color="#9ca3af" />
                          ) : (
                            <ChevronRight size={20} color="#9ca3af" />
                          )}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div style={{
                          padding: '1rem',
                          backgroundColor: 'white',
                          borderTop: '1px solid #e5e7eb',
                          animation: 'slideDown 0.3s ease-out'
                        }}>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#6b7280',
                            marginBottom: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Sample Questions
                          </h4>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                          }}>
                            {category.questions.filter((question) => {
                              if (!searchQuery.trim()) return true
                              return question.toLowerCase().includes(searchQuery.toLowerCase())
                            }).map((question, idx) => {
                              const originalIdx = category.questions.indexOf(question)
                              const key = `${category.id}_${originalIdx}`
                              const isSubmitted = submittedAnswers[key]
                              const isAnalyzing = analyzingAnswers[key]
                              const hasAnalysis = aiAnalysis[key]
                              const allAnswered = category.questions.every((_, i) => submittedAnswers[`${category.id}_${i}`])
                              
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    padding: '1rem',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.75rem',
                                    marginBottom: '0.75rem'
                                  }}>
                                    <span style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '24px',
                                      height: '24px',
                                      backgroundColor: isSubmitted ? '#10b981' : category.color,
                                      color: 'white',
                                      borderRadius: '50%',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      flexShrink: 0
                                    }}>
                                      {isSubmitted ? <CheckCircle size={14} /> : originalIdx + 1}
                                    </span>
                                    <p style={{
                                      margin: 0,
                                      color: '#374151',
                                      fontSize: '0.9375rem',
                                      lineHeight: '1.5',
                                      fontWeight: '500'
                                    }}>
                                      {question}
                                    </p>
                                  </div>
                                  
                                  <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                                    <textarea
                                      value={answers[key] || ''}
                                      onChange={(e) => handleAnswerChange(category.id, idx, e.target.value)}
                                      disabled={isSubmitted}
                                      placeholder="Type your answer here... (minimum 10 characters)"
                                      style={{
                                        width: '100%',
                                        minHeight: '100px',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '0.9375rem',
                                        resize: 'vertical',
                                        backgroundColor: isSubmitted ? '#f3f4f6' : 'white',
                                        color: '#374151',
                                        outline: 'none'
                                      }}
                                    />
                                    {!isSubmitted && (
                                      <div style={{
                                        position: 'absolute',
                                        bottom: '0.5rem',
                                        right: '0.75rem',
                                        fontSize: '0.75rem',
                                        color: (answers[key]?.trim().length || 0) >= 10 ? '#10b981' : '#9ca3af',
                                        fontWeight: '500'
                                      }}>
                                        {answers[key]?.trim().length || 0}/10 characters
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center'
                                  }}>
                                    {!isSubmitted && (
                                      <button
                                        onClick={() => handleSubmitAnswer(category.id, originalIdx, question)}
                                        disabled={isAnalyzing || !answers[key] || answers[key].trim().length < 10}
                                        style={{
                                          padding: '0.5rem 1rem',
                                          backgroundColor: (isAnalyzing || !answers[key] || answers[key].trim().length < 10) ? '#9ca3af' : '#06b6d4',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '6px',
                                          fontSize: '0.875rem',
                                          fontWeight: '600',
                                          cursor: (isAnalyzing || !answers[key] || answers[key].trim().length < 10) ? 'not-allowed' : 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.5rem',
                                          transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!isAnalyzing && answers[key] && answers[key].trim().length >= 10) {
                                            e.currentTarget.style.backgroundColor = '#0891b2'
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isAnalyzing && answers[key] && answers[key].trim().length >= 10) {
                                            e.currentTarget.style.backgroundColor = '#06b6d4'
                                          }
                                        }}
                                      >
                                        {isAnalyzing ? (
                                          <>
                                            <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                            Analyzing...
                                          </>
                                        ) : (
                                          'Submit Answer'
                                        )}
                                      </button>
                                    )}
                                    
                                    {hasAnalysis && (
                                      <button
                                        onClick={() => viewAnalysis(category.id, originalIdx, question)}
                                        style={{
                                          padding: '0.5rem 1rem',
                                          backgroundColor: '#10b981',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '6px',
                                          fontSize: '0.875rem',
                                          fontWeight: '600',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.5rem'
                                        }}
                                      >
                                        <FileText size={14} />
                                        View AI Analysis
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                          
                          {category.questions.every((_, i) => submittedAnswers[`${category.id}_${i}`]) && (
                            <div style={{
                              marginTop: '1.5rem',
                              padding: '1rem',
                              backgroundColor: '#ecfdf5',
                              borderRadius: '8px',
                              border: '2px solid #10b981'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: apiQuestions[category.id]?.length > 0 ? '1rem' : 0
                              }}>
                                <div>
                                  <h4 style={{
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    color: '#059669',
                                    margin: 0,
                                    marginBottom: '0.25rem'
                                  }}>
                                    🎉 All Questions Completed!
                                  </h4>
                                  <p style={{
                                    fontSize: '0.875rem',
                                    color: '#065f46',
                                    margin: 0
                                  }}>
                                    Generate a comprehensive analysis of all {category.questions.length} answers
                                  </p>
                                </div>
                                <button
                                  onClick={() => generateCategorySummary(category.id)}
                                  style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  <FileText size={16} />
                                  Generate Summary Report
                                </button>
                              </div>
                              
                              <button
                                onClick={() => fetchMoreQuestions(category.id)}
                                disabled={loadingApiQuestions[category.id]}
                                style={{
                                  width: '100%',
                                  padding: '0.75rem',
                                  backgroundColor: loadingApiQuestions[category.id] ? '#9ca3af' : '#06b6d4',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  cursor: loadingApiQuestions[category.id] ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem'
                                }}
                              >
                                {loadingApiQuestions[category.id] ? (
                                  <>
                                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    Loading More Questions...
                                  </>
                                ) : (
                                  <>
                                    <HelpCircle size={16} />
                                    Load 5 More Questions
                                  </>
                                )}
                              </button>
                              
                              {apiQuestions[category.id]?.length > 0 && (
                                <p style={{
                                  fontSize: '0.75rem',
                                  color: '#059669',
                                  margin: '0.5rem 0 0 0',
                                  textAlign: 'center'
                                }}>
                                  {apiQuestions[category.id].length} additional questions loaded
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Usage Info */}
            {usageInfo && usageInfo.remaining !== -1 && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: usageInfo.remaining > 0 ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${usageInfo.remaining > 0 ? '#86efac' : '#fca5a5'}`,
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  color: usageInfo.remaining > 0 ? '#166534' : '#991b1b',
                  fontWeight: '600'
                }}>
                  {usageInfo.remaining > 0 
                    ? `${usageInfo.remaining} question${usageInfo.remaining !== 1 ? 's' : ''} remaining this month`
                    : 'Monthly question limit reached'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Limit Reached Modal */}
    {showLimitModal && (
      <div
        onClick={() => setShowLimitModal(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}
        >
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Monthly Limit Reached
          </h3>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            You've used all {usageInfo?.limit} question bank sessions for this month. Upgrade to Premium or Professional for unlimited access!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => router.push('/pricing')}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Upgrade Plan
            </button>
            <button
              onClick={() => setShowLimitModal(false)}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {showAnalysisModal && currentAnalysis && (
      <div
        onClick={() => setShowAnalysisModal(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}>
              AI Analysis Report
            </h3>
            <button
              onClick={() => setShowAnalysisModal(false)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: '#6b7280'
              }}
            >
              ×
            </button>
          </div>

          {currentAnalysis.isSummary && currentAnalysis.allAnswers ? (
            <div style={{
              marginBottom: '1.5rem',
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '1rem',
                textTransform: 'uppercase'
              }}>
                All Questions & Answers
              </h4>
              {currentAnalysis.allAnswers.map((qa, idx) => (
                <div key={idx} style={{
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: idx < currentAnalysis.allAnswers.length - 1 ? '1px solid #e5e7eb' : 'none'
                }}>
                  <p style={{
                    margin: 0,
                    marginBottom: '0.5rem',
                    color: '#111827',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    Q{idx + 1}: {qa.question}
                  </p>
                  <p style={{
                    margin: 0,
                    color: '#6b7280',
                    fontSize: '0.8125rem',
                    lineHeight: '1.5'
                  }}>
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}>
                  Question
                </h4>
                <p style={{
                  margin: 0,
                  color: '#374151',
                  fontSize: '1rem',
                  lineHeight: '1.5'
                }}>
                  {currentAnalysis.question}
                </p>
              </div>

              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}>
                  Your Answer
                </h4>
                <p style={{
                  margin: 0,
                  color: '#374151',
                  fontSize: '0.9375rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {currentAnalysis.answer}
                </p>
              </div>
            </>
          )}

          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            border: '1px solid #10b981'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#059669',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}>
              AI Analysis
            </h4>
            <p style={{
              margin: 0,
              color: '#065f46',
              fontSize: '0.9375rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {currentAnalysis.analysis}
            </p>
          </div>

          <button
            onClick={exportToPDF}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={18} />
            Export as PDF
          </button>
        </div>
      </div>
    )}
    </>
  )
}
