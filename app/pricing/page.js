'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Pricing() {
  const router = useRouter()
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [processingPlan, setProcessingPlan] = useState(null)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleSelectPlan = async (plan, price, period) => {
    if (plan === 'free') {
      router.push('/login')
      return
    }

    // Check if user is logged in
    if (!user) {
      alert('Please login first to subscribe')
      router.push('/login')
      return
    }

    setProcessingPlan(plan)

    try {
      // Create PayMongo checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: price,
          description: `InterviewPro ${period === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
          plan: plan,
          period: period,
          userId: user.uid
        })
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        // Store session info in both localStorage AND sessionStorage for redundancy
        const paymentData = {
          sessionId: data.sessionId,
          plan: plan,
          period: period,
          userId: user.uid,
          timestamp: Date.now()
        }
        
        localStorage.setItem('pendingPayment', JSON.stringify(paymentData))
        sessionStorage.setItem('pendingPayment', JSON.stringify(paymentData))
        
        console.log('Stored payment data:', paymentData)
        console.log('Redirecting to:', data.checkoutUrl)
        
        // Redirect to PayMongo checkout page
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to process payment. Please try again.')
      setProcessingPlan(null)
    }
  }

  const openTermsModal = (e) => {
    e.preventDefault()
    setShowTermsModal(true)
  }

  const closeTermsModal = () => {
    setShowTermsModal(false)
  }



  return (
    <>
      <style jsx>{`
        .pricing-container {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Poppins', sans-serif;
          color: #333;
          padding: 2rem 1rem;
          position: relative;
          overflow-x: hidden;
        }

        .back-button {
          position: absolute;
          top: 2rem;
          left: 2rem;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #333;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .back-button:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          opacity: ${isVisible ? '1' : '0'};
          transform: translateY(${isVisible ? '0' : '30px'});
          transition: all 0.8s ease;
        }

        .header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1e293b;
        }

        .header p {
          font-size: 1rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .pricing-cards {
          display: flex;
          justify-content: center;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
        }

        .pricing-card {
          background: #fff;
          border: 2px solid #7dd3fc;
          border-radius: 15px;
          padding: 2rem 1.5rem;
          width: 320px;
          text-align: center;
          position: relative;
          overflow: visible;
          opacity: ${isVisible ? '1' : '0'};
          transform: translateY(${isVisible ? '0' : '50px'});
          transition: all 0.8s ease;
          color: #333;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .pricing-card.free {
          border-color: #7dd3fc;
          transition-delay: 0.2s;
        }

        .pricing-card.monthly {
          border-color: #7dd3fc;
          transition-delay: 0.4s;
        }

        .pricing-card.yearly {
          border-color: #7dd3fc;
          transition-delay: 0.6s;
        }

        .pricing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(125, 211, 252, 0.3);
          border-color: #0ea5e9;
        }

        .plan-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
        }

        .plan-icon.free {
          background: #22d3ee;
        }

        .plan-icon.premium {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
        }

        .plan-name {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #333;
        }

        .plan-name.free {
          color: #22d3ee;
        }

        .plan-price {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .plan-price.free {
          color: #22d3ee;
        }

        .plan-price.premium {
          color: #0ea5e9;
        }

        .plan-period {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .premium-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #fff;
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(-2deg);
          }
          50% {
            transform: translateY(-12px) rotate(0deg);
          }
          75% {
            transform: translateY(-8px) rotate(2deg);
          }
        }

        .yearly-badge {
          background: #ef4444;
          color: #fff;
          padding: 0.3rem 0.8rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 2rem 0;
          text-align: left;
        }

        .features-list li {
          padding: 0.6rem 0;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.9rem;
          color: #555;
        }

        .check-icon {
          width: 20px;
          height: 20px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.8rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .cross-icon {
          width: 20px;
          height: 20px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.8rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .info-icon {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.7rem;
          font-weight: bold;
          flex-shrink: 0;
        }
        
        .info-icon svg {
          width: 12px;
          height: 12px;
        }

        .select-button {
          width: 100%;
          padding: 1rem 2rem;
          background: #4a5568;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .select-button:hover:not(:disabled) {
          background: #2d3748;
          transform: translateY(-2px);
        }

        .select-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .terms-section {
          max-width: 600px;
          margin: 3rem auto 2rem;
          text-align: center;
          color: #64748b;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .terms-checkbox input {
          margin-top: 0.2rem;
        }

        .terms-link {
          color: #0ea5e9;
          text-decoration: none;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        .get-started-button {
          width: 100%;
          max-width: 400px;
          padding: 1.2rem 2rem;
          background: #4a5568;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 auto;
          display: block;
        }

        .get-started-button:hover {
          background: #2d3748;
          transform: translateY(-2px);
        }

        .description-text {
          max-width: 500px;
          margin: 2rem auto;
          color: #64748b;
          font-style: italic;
          text-align: center;
          line-height: 1.5;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: #fff;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: #fff;
          border-radius: 12px 12px 0 0;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .modal-body {
          padding: 2rem;
          line-height: 1.6;
          color: #374151;
        }

        .modal-section {
          margin-bottom: 2rem;
        }

        .modal-section h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .modal-section p {
          margin-bottom: 1rem;
        }

        .modal-section ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .modal-section li {
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .pricing-cards {
            flex-direction: column;
            align-items: center;
          }

          .pricing-card {
            width: 100%;
            max-width: 400px;
            margin-bottom: 1rem;
          }

          .pricing-card:nth-child(2) {
            transform: scale(1);
          }

          .header h1 {
            font-size: 2.5rem;
          }

          .back-button {
            top: 1rem;
            left: 1rem;
            padding: 0.6rem 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .pricing-container {
            padding: 1rem 0.5rem;
          }

          .header h1 {
            font-size: 2rem;
          }

          .header p {
            font-size: 1rem;
          }

          .pricing-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="pricing-container">
        <button className="back-button" onClick={handleBackToHome}>
          Back to Home
        </button>

        <div className="header">
          <h1>Choose Your Plan</h1>
          <p>Select the perfect plan for interview prep</p>
        </div>

        <div className="pricing-cards">
          {/* Free Plan */}
          <div className="pricing-card free">
            <div className="plan-icon free">FREE</div>
            <div className="plan-name free">Community Plan (Free)</div>

            <ul className="features-list">
              <li><span className="check-icon">✓</span> 5 mock interview sessions per month</li>
              <li><span className="check-icon">✓</span> 20 Question bank sessions</li>
              <li><span className="check-icon">✓</span> Basic interview feedback access</li>
              <li><span className="info-icon"><RefreshCw size={16} /></span> Mock interview and question bank sessions renew every month</li>
              <li><span className="cross-icon">✗</span> No personalized coaching</li>
            </ul>
            <button
              className="select-button"
              onClick={() => handleSelectPlan('free', 0, 'free')}
            >
              Get Started Free
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="pricing-card monthly">
            <div className="premium-badge">🏆</div>
            <div className="plan-price premium">₱399</div>
            <div className="plan-period">/month</div>

            <ul className="features-list">
              <li><span className="check-icon">✓</span> Unlimited Live AI Interview Sessions</li>
              <li><span className="check-icon">✓</span> Unlimited Question Bank Session</li>
              <li><span className="check-icon">✓</span> Advanced interview feedback access</li>
              <li><span className="check-icon">✓</span> Strength and Weakness Analysis</li>
            </ul>
            <button
              className="select-button"
              onClick={() => handleSelectPlan('premium', 399, 'monthly')}
              disabled={processingPlan === 'premium'}
            >
              {processingPlan === 'premium' ? 'Processing...' : 'Select Monthly Plan'}
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="pricing-card yearly">
            <div className="premium-badge">🏆</div>
            <div className="plan-price premium">₱3830</div>
            <div className="plan-period">/year</div>

            <ul className="features-list">
              <li><span className="check-icon">✓</span> Unlimited Live AI Interview Sessions</li>
              <li><span className="check-icon">✓</span> Unlimited Question Bank Sessions</li>
              <li><span className="check-icon">✓</span> Advanced interview feedback access</li>
              <li><span className="check-icon">✓</span> Strength and Weakness Analysis</li>
              <li><span className="yearly-badge">Save 20% when purchasing yearly</span></li>
            </ul>
            <button
              className="select-button"
              onClick={() => handleSelectPlan('professional', 3830, 'yearly')}
              disabled={processingPlan === 'professional'}
            >
              {processingPlan === 'professional' ? 'Processing...' : 'Select Yearly Plan'}
            </button>
          </div>
        </div>

        <div className="description-text">
          Practice for free with 5 mock interviews per month, 20 question bank sessions, and basic feedback. Ideal for building confidence at your own pace.
        </div>

        <div className="terms-section">
          <div className="terms-checkbox">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              By checking this box, you acknowledge that you have read, understood, and agree to the{' '}
              <a href="#" className="terms-link" onClick={openTermsModal}>InterviewPro Terms and Conditions</a>, including the subscription, billing, and cancellation policies.
            </label>
          </div>

          <button
            className="get-started-button"
            onClick={() => handleSelectPlan('free')}
          >
            Get Started
          </button>
        </div>

        {/* Terms and Conditions Modal */}
        {showTermsModal && (
          <div className="modal-overlay" onClick={closeTermsModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">InterviewPro Terms and Conditions</h2>
                <button className="modal-close" onClick={closeTermsModal}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-section">
                  <p><strong>Last Updated:</strong> January 2025</p>
                  <p>Welcome to InterviewPro. These Terms and Conditions ("Terms") govern your use of our interview preparation platform and services.</p>
                </div>

                <div className="modal-section">
                  <h3>1. Service Description</h3>
                  <p>InterviewPro provides AI-powered interview preparation services including:</p>
                  <ul>
                    <li>Mock interview sessions with AI feedback</li>
                    <li>Question bank access for practice</li>
                    <li>Performance analytics and improvement recommendations</li>
                    <li>Strength and weakness analysis</li>
                  </ul>
                </div>

                <div className="modal-section">
                  <h3>2. Subscription Plans</h3>
                  <p><strong>Free Plan:</strong> Includes 5 mock interview sessions and 20 question bank sessions per month with basic feedback.</p>
                  <p><strong>Monthly Plan (₱399/month):</strong> Unlimited access to all features including advanced feedback and analytics.</p>
                  <p><strong>Yearly Plan (₱3830/year):</strong> Same as monthly plan with 20% savings when paid annually.</p>
                </div>

                <div className="modal-section">
                  <h3>3. Billing and Payment</h3>
                  <ul>
                    <li>Subscription fees are charged in advance on a monthly or yearly basis</li>
                    <li>All payments are processed securely through our payment partners</li>
                    <li>Prices are subject to change with 30 days notice</li>
                    <li>Failed payments may result in service suspension</li>
                  </ul>
                </div>

                <div className="modal-section">
                  <h3>4. Cancellation Policy</h3>
                  <ul>
                    <li>You may cancel your subscription at any time from your account settings</li>
                    <li>Cancellation takes effect at the end of your current billing period</li>
                    <li>No refunds for partial months or unused sessions</li>
                    <li>Free plan users can delete their account at any time</li>
                  </ul>
                </div>

                <div className="modal-section">
                  <h3>5. User Responsibilities</h3>
                  <ul>
                    <li>Provide accurate information during registration</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use the service for legitimate interview preparation purposes</li>
                    <li>Respect intellectual property rights</li>
                  </ul>
                </div>

                <div className="modal-section">
                  <h3>6. Privacy and Data</h3>
                  <p>Your privacy is important to us. We collect and use your data in accordance with our Privacy Policy to:</p>
                  <ul>
                    <li>Provide personalized interview feedback</li>
                    <li>Track your progress and improvement</li>
                    <li>Enhance our AI algorithms</li>
                    <li>Send service-related communications</li>
                  </ul>
                </div>

                <div className="modal-section">
                  <h3>7. Limitation of Liability</h3>
                  <p>InterviewPro is provided "as is" without warranties. We are not liable for:</p>
                  <ul>
                    <li>Interview outcomes or job placement results</li>
                    <li>Technical issues or service interruptions</li>
                    <li>Loss of data or content</li>
                    <li>Indirect or consequential damages</li>
                  </ul>
                </div>

                <div className="modal-section">
                  <h3>8. Contact Information</h3>
                  <p>For questions about these Terms or our services, please contact us at:</p>
                  <p>Email: ai.interview.capstone@gmail.com<br />
                    Phone: +63 9762804013</p>
                </div>

                <div className="modal-section">
                  <p><em>By using InterviewPro, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</em></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}