import React from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const EmailVerification = ({ onProceed, userEmail }) => {
  const handleProceed = () => {
    console.log('Email verification completed');
    onProceed();
  };

  return (
    <>
      <style jsx>{`
        .left-side {
          width: 50%;
          height: 100vh;
          position: relative;
          overflow: hidden;
          display: block;
          margin: 0;
          padding: 0;
        }
        .right-side {
          width: 50%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: white;
          margin: 0;
          box-sizing: border-box;
        }
        @media (max-width: 1023px) {
          .left-side {
            display: none;
          }
          .right-side {
            width: 100%;
          }
        }
      `}</style>
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
      <div className="left-side">
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

      {/* Right side - Email Verification */}
      <div className="right-side">
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

          {/* Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Email Verification
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              lineHeight: '1.6',
              maxWidth: '320px'
            }}>
              Please check your email and click the verification link to activate your account. If you don't see it, check your spam folder.
            </p>
          </div>

          {/* Email Verification Illustration */}
          <div style={{
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              position: 'relative',
              width: '200px',
              height: '160px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Envelope Base */}
              <div style={{
                width: '140px',
                height: '100px',
                backgroundColor: '#ff9999',
                borderRadius: '8px',
                position: 'relative',
                boxShadow: '0 8px 25px rgba(255, 153, 153, 0.3)',
                zIndex: 1
              }}>
                {/* Envelope opening/flap */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50px',
                  backgroundColor: '#ff7f7f',
                  borderRadius: '8px 8px 0 0',
                  clipPath: 'polygon(0 0, 50% 80%, 100% 0)',
                  zIndex: 2
                }}></div>
              </div>

              {/* Verification Letter/Paper */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120px',
                height: '90px',
                backgroundColor: '#f8f4ff',
                borderRadius: '6px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e5e7eb'
              }}>
                {/* VERIFICATION text on the letter */}
                <div style={{
                  fontSize: '0.7rem',
                  color: '#6b7280',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  VERIFICATION
                </div>

                {/* Decorative lines on the letter */}
                <div style={{
                  width: '60px',
                  height: '2px',
                  backgroundColor: '#d1d5db',
                  marginBottom: '4px'
                }}></div>
                <div style={{
                  width: '80px',
                  height: '2px',
                  backgroundColor: '#d1d5db',
                  marginBottom: '4px'
                }}></div>
                <div style={{
                  width: '50px',
                  height: '2px',
                  backgroundColor: '#d1d5db'
                }}></div>
              </div>

              {/* Green Check Circle */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '50px',
                height: '50px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                zIndex: 4,
                border: '3px solid white'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* User Email Display */}
          {userEmail && (
            <div style={{
              marginBottom: '2rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#374151',
              textAlign: 'center'
            }}>
              Verification email sent to: <strong>{userEmail}</strong>
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0891b2'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#06b6d4'}
          >
            Proceed
          </button>

          {/* Resend Email Link */}
          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center'
          }}>
            <button
              onClick={() => console.log('Resend verification email')}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Didn't receive the email? Resend verification
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EmailVerification;