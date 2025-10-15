'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, ArrowLeft } from 'lucide-react'

import ChatBubbleLogo from '../../components/ChatBubbleLogo'

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (!formData.password) {
      setError('Password is required')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (data.success) {
        const params = new URLSearchParams({
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          code: data.verificationCode
        })
        router.push(`/email-verification?${params.toString()}`)
      } else {
        setError(data.error || 'Failed to send verification email')
      }
    } catch (error) {
      setError('Failed to send verification email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onBackToLogin = () => {
    router.push('/login')
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  return (
    <div style={{ 
      height: '100vh',
      width: '100vw',
      display: 'flex',
      fontFamily: 'Inter, sans-serif',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Left side - Background Image */}
      <div style={{
        width: '50%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'block' : 'none',
        margin: 0,
        padding: 0
      }}>
        <img
          src="https://images.pexels.com/photos/3874038/pexels-photo-3874038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Two people having a conversation"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}></div>
      </div>

      {/* Right side - Sign Up Form */}
      <div style={{
        width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '50%' : '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        margin: 0,
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* Back to Login - Top Right Corner */}
        <button
          onClick={onBackToLogin}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
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
          Back to Login
        </button>

        <div style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Chat Icon */}
          <div style={{
            marginBottom: '2rem'
          }}>
            <ChatBubbleLogo size={64} />
          </div>

          {/* Title and Description */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Sign Up
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              lineHeight: '1.6',
              maxWidth: '320px'
            }}>
              Create your account to start practicing real-time mock interviews and get AI-powered feedback.
            </p>
          </div>

          {error && (
            <div style={{
              width: '100%',
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              borderRadius: '0.5rem'
            }}>
              {error}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} style={{ 
            width: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem' 
          }}>
            {/* Full Name Input */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <User size={20} color="#9ca3af" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  fontSize: '1rem',
                  color: '#111827',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Email Input */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <Mail size={20} color="#9ca3af" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  fontSize: '1rem',
                  color: '#111827',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Password Input */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <Lock size={20} color="#9ca3af" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  fontSize: '1rem',
                  color: '#111827',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <Lock size={20} color="#9ca3af" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  fontSize: '1rem',
                  color: '#111827',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <button
                type="button"
                onClick={handleSignIn}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: '1px solid #22d3ee',
                  color: '#06b6d4',
                  backgroundColor: 'transparent',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0fdfa'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Sign In
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: loading ? '#9ca3af' : '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#0891b2'
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#06b6d4'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}