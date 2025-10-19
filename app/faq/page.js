'use client'
import React, { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

export default function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const faqs = [
    {
      question: "How does the AI interview work?",
      answer: "Our AI interviewer uses advanced speech recognition and natural language processing to conduct realistic interview sessions. It asks questions, listens to your responses, and provides instant feedback on your performance."
    },
    {
      question: "Can I customize the interview questions?",
      answer: "Yes! You can choose from our Question Bank or create custom interview sessions tailored to specific job roles, industries, or skill levels."
    },
    {
      question: "How is my performance rated?",
      answer: "The AI evaluates your responses based on clarity, relevance, confidence, and content quality. You'll receive a score out of 5 for each answer, along with detailed feedback on strengths and areas for improvement."
    },
    {
      question: "Can I retry my answers?",
      answer: "Absolutely! If you enable the 'Retry Answer' option in your interview settings, you can redo your response before moving to the next question."
    },
    {
      question: "Is my interview data secure?",
      answer: "Yes, we take your privacy seriously. All interview sessions and personal data are encrypted and stored securely. We never share your information with third parties."
    },
    {
      question: "What subscription plans are available?",
      answer: "We offer Free, Pro, and Premium plans. The Free plan includes limited interviews per month, while Pro and Premium plans offer unlimited interviews, advanced analytics, and priority support."
    },
    {
      question: "Can I use InterviewPro on mobile devices?",
      answer: "Yes! InterviewPro is fully responsive and works seamlessly on desktop, tablet, and mobile devices. You can practice interviews anywhere, anytime."
    },
    {
      question: "How do I improve my interview skills?",
      answer: "Review your past interviews in the Strengths and Weakness Overview sections. Focus on areas where you scored lower, practice regularly, and use the AI's feedback to refine your responses."
    },
    {
      question: "Can I pause an interview session?",
      answer: "Currently, interview sessions are designed to be completed in one sitting to simulate real interview conditions. However, you can always start a new session at any time."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team through the App Info page or by emailing ai.interview.capstone@gmail.com. We typically respond within 24 hours."
    }
  ]

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      <Sidebar activeItem="faq" />

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
            paddingTop: '2rem',
            paddingBottom: '3rem',
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
                <HelpCircle size={120} color="white" strokeWidth={1.5} />
              </div>

              <div style={{ textAlign: 'left' }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  marginBottom: '0.75rem'
                }}>
                  Frequently Asked Questions
                </h1>

                <p style={{
                  fontSize: '1.125rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Find answers to common questions about InterviewPro and how to make the most of your practice sessions.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '2rem',
            marginTop: '2rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    style={{
                      width: '100%',
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: expandedIndex === index ? '#f0f9ff' : 'white',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: expandedIndex === index ? '#06b6d4' : '#374151'
                    }}>
                      {faq.question}
                    </span>
                    {expandedIndex === index ? (
                      <ChevronUp size={20} color="#06b6d4" />
                    ) : (
                      <ChevronDown size={20} color="#9ca3af" />
                    )}
                  </button>

                  <div style={{
                    maxHeight: expandedIndex === index ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease-in-out, padding 0.4s ease-in-out',
                    padding: expandedIndex === index ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem',
                    backgroundColor: '#f0f9ff'
                  }}>
                    <p style={{
                      fontSize: '1rem',
                      color: '#6b7280',
                      margin: 0,
                      lineHeight: '1.6',
                      opacity: expandedIndex === index ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out 0.1s'
                    }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Still Have Questions Section */}
            <div style={{
              marginTop: '3rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#374151',
                margin: 0,
                marginBottom: '1rem'
              }}>
                Still have questions?
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: 0,
                marginBottom: '1.5rem'
              }}>
                Can't find the answer you're looking for? Please reach out to our support team.
              </p>
              <a
                href="mailto:ai.interview.capstone@gmail.com"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
