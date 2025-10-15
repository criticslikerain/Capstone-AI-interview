'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, ArrowLeft } from 'lucide-react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'
import ChatBubbleLogo from '../../components/ChatBubbleLogo'

export default function EmailVerification() {
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get('email')
  const fullName = searchParams.get('fullName')
  const password = searchParams.get('password')
  const sentCode = searchParams.get('code')

  useEffect(() => {
    if (!email || !fullName || !password || !sentCode) {
      router.push('/signup')
    }
  }, [email, fullName, password, sentCode, router])

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!verificationCode.trim()) {
      setError('Please enter the verification code')
      setLoading(false)
      return
    }

    if (verificationCode !== sentCode) {
      setError('Invalid verification code')
      setLoading(false)
      return
    }

    try {
      const [firstName, ...lastNameParts] = fullName.split(' ')
      const lastName = lastNameParts.join(' ') || firstName
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        first_name: firstName,
        last_name: lastName,
        user_type: 'user',
        is_active: true,
        is_email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      })

      router.push('/login?message=Account created successfully! Please sign in with your credentials.')
    } catch (error) {
      let errorMessage = 'Account creation failed'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already taken'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResending(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        const newUrl = new URL(window.location)
        newUrl.searchParams.set('code', data.verificationCode)
        window.history.replaceState({}, '', newUrl)
        
        alert('New verification code sent to your email!')
      } else {
        setError('Failed to resend verification code')
      }
    } catch (error) {
      setError('Failed to resend verification code')
    } finally {
      setResending(false)
    }
  }

  const handleBackToSignup = () => {
    router.push('/signup')
  }

  return (
    <div style={{ 
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        {/* Back Button */}
        <button
          onClick={handleBackToSignup}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '0.875rem',
            padding: '0.5rem'
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Back
        </button>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
            <ChatBubbleLogo size={48} />
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Verify Your Email
          </h1>

          {/* Description */}
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            We've sent a 5-digit verification code to<br />
            <strong>{email}</strong>
          </p>

          {/* Mail Icon */}
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '1rem',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <Mail size={24} color="#06b6d4" />
          </div>

          {error && (
            <div style={{
              width: '100%',
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleVerify} style={{ width: '100%' }}>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 5-digit code"
              maxLength="5"
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                outline: 'none',
                fontSize: '1.125rem',
                textAlign: 'center',
                letterSpacing: '0.5rem',
                marginBottom: '1.5rem',
                boxSizing: 'border-box'
              }}
              required
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: loading ? '#9ca3af' : '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '1rem'
              }}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend Code */}
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            Didn't receive the code?
          </p>
          
          <button
            onClick={handleResendCode}
            disabled={resending}
            style={{
              background: 'none',
              border: 'none',
              color: '#06b6d4',
              cursor: resending ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              textDecoration: 'underline'
            }}
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  )
}