'use client'
import { useEffect, useState } from 'react'
import { auth, db } from '../../lib/firebase'

export default function TestFirebase() {
  const [status, setStatus] = useState('Testing Firebase...')

  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('Firebase Auth:', auth)
        console.log('Firebase DB:', db)
        console.log('Firebase Config:', {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        })
        
        setStatus('Firebase initialized successfully!')
      } catch (error) {
        console.error('Firebase test error:', error)
        setStatus(`Firebase error: ${error.message}`)
      }
    }

    testFirebase()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Firebase Test</h1>
      <p>{status}</p>
      <div>
        <h3>Environment Variables:</h3>
        <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not set'}</p>
        <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set'}</p>
        <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Not set'}</p>
      </div>
    </div>
  )
}