import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LiveAIInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedInterviewType, setSelectedInterviewType] = useState('behavioral');
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [voiceRecording, setVoiceRecording] = useState(true);
  const [videoRecording, setVideoRecording] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    // Get topic from navigation state or sessionStorage
    const topic = location.state?.topic || sessionStorage.getItem('selectedTopic') || 'Software Engineering';
    setSelectedTopic(topic);
    sessionStorage.setItem('selectedTopic', topic);
  }, [location]);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f8fafc'
    }}>
      {/* 3D Robot Section */}
      <div style={{
        flex: '0 0 400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          width: '350px',
          aspectRatio: '1 / 1',
          border: 'none',
          overflow: 'hidden',
          borderRadius: '10px',
          position: 'relative'
        }}>
          <iframe
            src="https://my.spline.design/genkubgreetingrobot-dKSdmkp6P4tsfaGKQgqQXWPd/"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="fullscreen; vr"
          ></iframe>
          {/* White mask to cover Spline copyright */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '350px',
            height: '45px',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            zIndex: 10
          }}></div>
        </div>
      </div>

      {/* Interview Setup Form */}
      <div style={{
        flex: '1',
        padding: '3rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Live AI Interview
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Set up your personalized interview experience
        </p>

        {/* Category Display */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            Category
          </h3>
          <div style={{
            padding: '1rem',
            backgroundColor: '#e0f2fe',
            border: '2px solid #06b6d4',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#06b6d4'
          }}>
            {selectedTopic}
          </div>
        </div>

        {/* Interview Type */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Interview Type
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            {['behavioral', 'technical', 'situational'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedInterviewType(type)}
                style={{
                  padding: '1.5rem 1rem',
                  backgroundColor: selectedInterviewType === type ? '#e0f2fe' : 'white',
                  border: selectedInterviewType === type ? '2px solid #06b6d4' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: selectedInterviewType === type ? '#06b6d4' : '#1f2937',
                  marginBottom: '0.5rem',
                  textTransform: 'capitalize'
                }}>
                  {type}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: '1.4'
                }}>
                  {type === 'behavioral' && 'Questions about your past experiences and behavior'}
                  {type === 'technical' && 'Technical skills and problem-solving questions'}
                  {type === 'situational' && 'Hypothetical scenarios and how you would handle them'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Difficulty Level
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                style={{
                  padding: '1.5rem 1rem',
                  backgroundColor: selectedDifficulty === level ? '#e0f2fe' : 'white',
                  border: selectedDifficulty === level ? '2px solid #06b6d4' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: selectedDifficulty === level ? '#06b6d4' : '#1f2937',
                  marginBottom: '0.5rem',
                  textTransform: 'capitalize'
                }}>
                  {level}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {level === 'beginner' && 'Entry-level questions'}
                  {level === 'intermediate' && 'Mid-level professional questions'}
                  {level === 'advanced' && 'Senior-level challenging questions'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interview Settings */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Interview Settings
          </h3>
          <div style={{
            display: 'flex',
            gap: '2rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: voiceRecording ? '#06b6d4' : '#e5e7eb',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {voiceRecording && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
              <span style={{ color: '#374151', fontSize: '0.875rem' }}>
                Voice Recording: Enabled
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: videoRecording ? '#06b6d4' : '#e5e7eb',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {videoRecording && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Video Recording: Optional
              </span>
            </div>
          </div>
        </div>

        {/* Start Interview Button */}
        <button
          onClick={() => {
            // Store interview configuration
            sessionStorage.setItem('interviewConfig', JSON.stringify({
              topic: selectedTopic,
              interviewType: selectedInterviewType,
              difficulty: selectedDifficulty,
              voiceRecording,
              videoRecording
            }));
            navigate('/voice-interview');
          }}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            backgroundColor: '#00bfa6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#00a38d'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#00bfa6'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Start Interview
        </button>
      </div>

      {/* Mobile responsive styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="display: flex"][style*="height: 100vh"] {
            flex-direction: column !important;
          }
          
          div[style*="flex: 0 0 400px"] {
            flex: none !important;
            padding: 1rem !important;
          }
          
          div[style*="flex: 1"][style*="padding: 3rem"] {
            padding: 2rem !important;
          }
        }
        
        @media (max-width: 768px) {
          div[style*="flex: 0 0 400px"] {
            display: none !important;
          }
          
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveAIInterview;