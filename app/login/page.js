'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import ChatBubbleLogo from '../components/ChatBubbleLogo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    if (!email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (!password) {
      setError('Password is required')
      setLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/user-dashboard')
    } catch (error) {
      let errorMessage = 'Login failed'
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email'
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Incorrect email or password'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    if (mounted && window.google) {
      window.google.accounts.id.prompt()
    } else {
      setError('Google Sign-In not available. Please try again.')
    }
  }

  React.useEffect(() => {
    if (mounted) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
            callback: handleGoogleCallback
          })
        }
      }

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }
  }, [mounted])

  const handleGoogleCallback = async (response) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push(data.redirectTo || '/user-dashboard')
      } else {
        setError(data.error || 'Google sign-in failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const onForgotPassword = () => {
    router.push('/forgot-password')
  }

  const onSignUp = () => {
    router.push('/signup')
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
        display: mounted && isLargeScreen ? 'block' : 'none',
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

      {/* Right side - Login Form */}
      <div style={{
        width: mounted && isLargeScreen ? '50%' : '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        margin: 0,
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px'
        }}>
          {/* Chat Icon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            <ChatBubbleLogo size={64} />
          </div>

          {/* Welcome Text */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Welcome Back!
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              Access your personalized interview<br />
              coach and start improving today!
            </p>
          </div>

          {successMessage && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#d1fae5',
              border: '1px solid #86efac',
              color: '#059669',
              borderRadius: '0.5rem'
            }}>
              {successMessage}
            </div>
          )}

          {error && (
            <div style={{
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
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
                  color: '#111827'
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
                  color: '#111827'
                }}
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '1rem',
                    height: '1rem',
                    marginRight: '0.5rem'
                  }}
                />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                style={{
                  fontSize: '0.875rem',
                  color: '#3b82f6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '0.75rem' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                type="button"
                onClick={onSignUp}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: '1px solid #22d3ee',
                  color: '#06b6d4',
                  backgroundColor: 'transparent',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Sign Up
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
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}