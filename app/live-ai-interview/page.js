'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mic, Video, Play } from 'lucide-react'

export default function LiveAIInterview() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('behavioral')
  const [difficulty, setDifficulty] = useState('intermediate')

  const interviewTypes = [
    { id: 'behavioral', name: 'Behavioral', description: 'Questions about your past experiences and behavior' },
    { id: 'technical', name: 'Technical', description: 'Technical skills and problem-solving questions' },
    { id: 'situational', name: 'Situational', description: 'Hypothetical scenarios and how you would handle them' }
  ]

  const difficultyLevels = [
    { id: 'beginner', name: 'Beginner', description: 'Entry-level questions' },
    { id: 'intermediate', name: 'Intermediate', description: 'Mid-level professional questions' },
    { id: 'advanced', name: 'Advanced', description: 'Senior-level challenging questions' }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => router.push('/user-dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Live AI Interview
          </h1>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
            Interview Setup
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Interview Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              {interviewTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  style={{
                    padding: '1rem',
                    border: selectedType === type.id ? '2px solid #06b6d4' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: selectedType === type.id ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    {type.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Difficulty Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              {difficultyLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setDifficulty(level.id)}
                  style={{
                    padding: '1rem',
                    border: difficulty === level.id ? '2px solid #06b6d4' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: difficulty === level.id ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    {level.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {level.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Interview Settings
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mic size={16} color="#06b6d4" />
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>Voice Recording: Enabled</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={16} color="#06b6d4" />
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>Video Recording: Optional</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              // Store interview configuration
              sessionStorage.setItem('interviewConfig', JSON.stringify({
                type: selectedType,
                difficulty: difficulty,
                responseType: 'voice'
              }))
              router.push('/voice-interview')
            }}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              backgroundColor: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
            }}
          >
            <Play size={20} />
            Start Interview
          </button>
        </div>
      </div>
    </div>
  )
}