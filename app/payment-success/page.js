'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Check, X, Loader2 } from 'lucide-react'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('Verifying your payment...')
  const [plan, setPlan] = useState('')
  const [period, setPeriod] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get pending payment from localStorage
        const pendingPaymentStr = localStorage.getItem('pendingPayment')
        
        if (!pendingPaymentStr) {
          setStatus('error')
          setMessage('No pending payment found')
          return
        }

        const pendingPayment = JSON.parse(pendingPaymentStr)
        const sessionId = pendingPayment.sessionId
        
        // Check if payment is not too old (24 hours)
        const paymentAge = Date.now() - pendingPayment.timestamp
        if (paymentAge > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('pendingPayment')
          setStatus('error')
          setMessage('Payment session expired')
          return
        }

        if (!user) {
          setStatus('error')
          setMessage('Please log in to verify your payment')
          return
        }

        // Verify user matches
        if (pendingPayment.userId !== user.uid) {
          setStatus('error')
          setMessage('User mismatch. Please contact support.')
          return
        }

        console.log('Verifying payment for session:', sessionId)
        console.log('User ID:', user.uid)

        // Call the verify payment API
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionId,
            userId: user.uid
          }),
        })

        const data = await response.json()
        console.log('Verification response:', data)

        if (response.ok && data.success) {
          // Clear pending payment from localStorage
          localStorage.removeItem('pendingPayment')
          
          setStatus('success')
          setMessage('Payment successful! Your subscription has been activated.')
          setPlan(data.plan || 'Premium')
          setPeriod(data.period || 'monthly')
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/user-dashboard')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Payment verification failed')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('error')
        setMessage('An error occurred while verifying your payment')
      }
    }

    if (user) {
      verifyPayment()
    }
  }, [user, searchParams, router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      fontFamily: 'Inter, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          {status === 'verifying' && (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Loader2 size={40} color="#06b6d4" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}
          {status === 'success' && (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Check size={40} color="#059669" strokeWidth={3} />
            </div>
          )}
          {status === 'error' && (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <X size={40} color="#dc2626" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          {status === 'verifying' && 'Verifying Payment'}
          {status === 'success' && 'Payment Successful!'}
          {status === 'error' && 'Payment Verification Failed'}
        </h1>

        {/* Message */}
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          {message}
        </p>

        {/* Plan Details */}
        {status === 'success' && plan && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#166534',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {plan} Plan - {period}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          {status === 'error' && (
            <>
              <button
                onClick={() => router.push('/pricing')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/user-dashboard')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Go to Dashboard
              </button>
            </>
          )}
          {status === 'success' && (
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Redirecting to dashboard...
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={40} color="#06b6d4" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
