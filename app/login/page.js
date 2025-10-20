'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import ChatBubbleLogo from '../components/ChatBubbleLogo'

function LoginContent() {
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
      // Sign in with Firebase Auth
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



  React.useEffect(() => {
    if (mounted) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      script.onload = () => {
        if (window.google) {
          try {
            console.log('Initializing Google Sign-In with origin:', window.location.origin)
            window.google.accounts.id.initialize({
              client_id: '379371456417-qg0d82b441pc6j2q6f8oq1aj18ajfpfu.apps.googleusercontent.com',
              callback: handleGoogleCallback,
              auto_select: false,
              cancel_on_tap_outside: true,
              use_fedcm_for_prompt: true
            })
            
            // Render the Google button
            const buttonDiv = document.getElementById('google-signin-button')
            if (buttonDiv) {
              window.google.accounts.id.renderButton(buttonDiv, {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left'
              })
            }
          } catch (error) {
            console.error('Google Sign-In initialization error:', error)
            setError('Google Sign-In initialization failed')
          }
        }
      }

      script.onerror = () => {
        console.error('Failed to load Google Sign-In script')
        setError('Failed to load Google Sign-In')
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
      console.log('Google callback received:', response)
      setLoading(true)
      setError('')
      
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      })

      const data = await res.json()

      if (res.ok) {
        router.replace(data.redirectTo || '/user-dashboard')
      } else {
        setError(data.error || 'Google sign-in failed')
      }
    } catch (error) {
      console.error('Google callback error:', error)
      setError('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
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
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                textAlign: 'center'
              }}>
                Or continue with
              </div>
              <div 
                id="google-signin-button" 
                style={{ 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              ></div>
            </div>

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

export default function Login() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}