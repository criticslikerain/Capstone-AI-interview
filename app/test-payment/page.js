'use client'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function TestPayment() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const testCheckout = async (plan, price, period) => {
    if (!user) {
      alert('Please login first')
      router.push('/login')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: price,
          description: `Test - InterviewPro ${period}`,
          plan: plan,
          period: period,
          userId: user.uid
        })
      })

      const data = await response.json()
      setResult(data)

      if (data.success && data.checkoutUrl) {
        // Redirect to checkout
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f9fafb',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          PayMongo Payment Test
        </h1>

        <div style={{
          backgroundColor: '#fef3c7',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #fbbf24'
        }}>
          <p style={{ margin: 0, color: '#92400e', fontSize: '0.875rem' }}>
            <strong> Test Mode:</strong> Using PayMongo test keys. No real money will be charged.
          </p>
        </div>

        {!user && (
          <div style={{
            backgroundColor: '#fee2e2',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #ef4444'
          }}>
            <p style={{ margin: 0, color: '#991b1b', fontSize: '0.875rem' }}>
              <strong> Not Logged In:</strong> Please login to test payments.
            </p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => testCheckout('premium', 399, 'monthly')}
            disabled={loading || !user}
            style={{
              padding: '1rem',
              backgroundColor: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: user ? 'pointer' : 'not-allowed',
              opacity: user ? 1 : 0.5
            }}
          >
            {loading ? 'Creating Checkout...' : 'Test Monthly Plan (₱399)'}
          </button>

          <button
            onClick={() => testCheckout('professional', 3830, 'yearly')}
            disabled={loading || !user}
            style={{
              padding: '1rem',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: user ? 'pointer' : 'not-allowed',
              opacity: user ? 1 : 0.5
            }}
          >
            {loading ? 'Creating Checkout...' : 'Test Yearly Plan (₱3830)'}
          </button>
        </div>

        {result && (
          <div style={{
            padding: '1rem',
            backgroundColor: result.success ? '#d1fae5' : '#fee2e2',
            borderRadius: '8px',
            border: `1px solid ${result.success ? '#10b981' : '#ef4444'}`,
            marginBottom: '2rem'
          }}>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              color: result.success ? '#065f46' : '#991b1b',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              {result.success ? '✓ Success' : '✗ Error'}
            </h3>
            <pre style={{
              margin: 0,
              fontSize: '0.75rem',
              color: result.success ? '#065f46' : '#991b1b',
              overflow: 'auto',
              whiteSpace: 'pre-wrap'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '1.5rem',
          borderRadius: '8px'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Test Card Numbers
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
            <p><strong>Success:</strong> 4343434343434345</p>
            <p><strong>Failed:</strong> 4571736000000075</p>
            <p><strong>3D Secure:</strong> 4120000000000007</p>
            <p style={{ marginTop: '1rem' }}>
              <strong>Expiry:</strong> Any future date (e.g., 12/25)<br />
              <strong>CVC:</strong> Any 3 digits (e.g., 123)<br />
              <strong>Name:</strong> Any name
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          display: 'flex',
          gap: '1rem'
        }}>
          <button
            onClick={() => router.push('/pricing')}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go to Pricing
          </button>
          <button
            onClick={() => router.push('/my-plan')}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go to My Plan
          </button>
        </div>
      </div>
    </div>
  )
}
