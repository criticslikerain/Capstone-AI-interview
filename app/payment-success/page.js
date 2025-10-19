'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { updateUserSubscription } from '../../lib/firebase'

export default function PaymentSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const plan = searchParams.get('plan')
  const period = searchParams.get('period')
  const userId = searchParams.get('userId')

  useEffect(() => {
    if (plan && period && userId && user) {
      // Verify user matches
      if (user.uid === userId) {
        updateSubscription()
      } else {
        setError('User mismatch')
        setLoading(false)
      }
    } else if (!plan || !period) {
      router.push('/pricing')
    }
  }, [plan, period, userId, user, router])

  const updateSubscription = async () => {
    try {
      // Wait a bit for webhook to process (if configured)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Calculate next billing date
      const nextBillingDate = new Date()
      if (period === 'yearly') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
      } else if (period === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
      }

      // Update subscription in Firebase
      const subscriptionData = {
        plan: plan,
        price: plan === 'premium' ? 399 : 3830,
        period: period,
        status: 'active',
        nextBillingDate: nextBillingDate.toISOString(),
        paymentMethod: 'PayMongo',
        lastPaymentDate: new Date().toISOString()
      }

      await updateUserSubscription(user.uid, subscriptionData)
      setLoading(false)
    } catch (err) {
      console.error('Subscription update error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleContinue = () => {
    router.push('/my-plan')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        {error ? (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Payment Verification Failed
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              {error}. Please contact support if you were charged.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              style={{
                width: '100%',
                padding: '0.875rem 2rem',
                backgroundColor: '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Back to Pricing
            </button>
          </>
        ) : loading ? (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.5rem',
              border: '4px solid #e5e7eb',
              borderTopColor: '#06b6d4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Processing Payment...
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              Please wait while we confirm your payment
            </p>
          </>
        ) : (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#d1fae5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.75rem'
            }}>
              Payment Successful!
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              Thank you for subscribing to InterviewPro. Your subscription is now active and you have full access to all premium features.
            </p>
            <button
              onClick={handleContinue}
              style={{
                width: '100%',
                padding: '0.875rem 2rem',
                backgroundColor: '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#06b6d4'}
            >
              Go to My Plan
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
