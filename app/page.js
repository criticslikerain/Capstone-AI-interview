'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [splineLoaded, setSplineLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    const handleSplineLoad = () => {
      setSplineLoaded(true)
      if (!isLoading) {
        setIsLoading(false)
      }
    }

    const splineViewer = document.querySelector('spline-viewer')
    if (splineViewer) {
      splineViewer.addEventListener('load', handleSplineLoad)
    }

    return () => {
      clearTimeout(timer)
      if (splineViewer) {
        splineViewer.removeEventListener('load', handleSplineLoad)
      }
    }
  }, [isLoading])

  const handleGetStarted = () => {
    router.push('/login')
  }

  const handlePricing = () => {
    router.push('/pricing')
  }

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
          color: #fff;
          background-color: #000;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .landing-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          touch-action: manipulation;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #0a0a0f 100%);
        }

        .mobile-background {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          background: linear-gradient(135deg, #0a192f 0%, #112240 25%, #1e3a5f 50%, #0d1b2a 75%, #000814 100%);
        }

        .mobile-background::before {
          content: '';
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 198, 255, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .mobile-background::after {
          content: '';
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(0, 114, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-20px); }
        }

        /* Loading Screen Styles */
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #bcf9fcff 0%, rgba(185, 244, 255, 1)ff 50%, #d3d4d7ff 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }

        .loading-screen.fade-out {
          opacity: 0;
          visibility: hidden;
        }

        .loading-logo {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #00c6ff, #0072ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 2rem;
          animation: pulse 2s infinite;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(0, 198, 255, 0.3);
          border-top: 3px solid #00c6ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-text {
          color: #ccc;
          font-size: 1.1rem;
          font-weight: 500;
          animation: fadeInOut 2s infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .main-content {
          opacity: ${isLoading ? '0' : '1'};
          transition: opacity 0.8s ease;
        }

        .spline-viewer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: 0;
        }

        /* Button Row (raised slightly higher) */
        .button-row {
          position: absolute;
          bottom: 32%;
          left: 12%;
          display: flex;
          flex-direction: row;
          gap: 1rem;
          z-index: 1;
        }

        .btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.8rem 1.8rem;
          background: linear-gradient(135deg, #00c6ff, #0072ff);
          color: #fff;
          border: none;
          border-radius: 40px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 3px 10px rgba(0, 198, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          white-space: nowrap;
        }

        .btn::after {
          content: "›";
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 198, 255, 0.5);
        }

        .btn:hover::after {
          transform: translateX(5px);
        }

        /* Copyright watermark cover */
        .copyright {
          position: absolute;
          bottom: 20px;
          right: 25px;
          z-index: 2;
          background: #000;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #ccc;
          font-weight: 500;
          width: 125px;
          height: 35px;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .invisible-pricing-button {
          position: absolute;
          bottom: 0;
          left: 45%;
          width: 10%;
          height: 10%;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 3;
          opacity: 0;
          margin-bottom: 20px;
        }

        /* Mobile Header Container */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          padding: 20px;
        }

        /* Slogan */
        .slogan {
          text-align: center;
          margin-bottom: 15px;
        }

        .slogan-title {
          font-size: 2.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #00c6ff, #0072ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 8px 0;
          letter-spacing: 1px;
        }

        .slogan-subtitle {
          font-size: 1rem;
          color: #b0b0b0;
          font-weight: 400;
          letter-spacing: 0.5px;
          margin: 0;
        }

        /* Desktop Message */
        .desktop-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(0, 198, 255, 0.08);
          border: 1px solid rgba(0, 198, 255, 0.25);
          border-radius: 12px;
          padding: 10px 20px;
          backdrop-filter: blur(10px);
          margin: 0 auto;
          max-width: fit-content;
        }

        .headphone-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .desktop-message-text {
          font-size: 0.85rem;
          color: #00c6ff;
          font-weight: 500;
          margin: 0;
          white-space: nowrap;
        }

        /* Tablet View */
        @media (max-width: 1024px) {
          .button-row {
            left: 10%;
            bottom: 28%;
            gap: 0.8rem;
          }

          .btn {
            padding: 0.75rem 1.6rem;
            font-size: 0.95rem;
          }

          .loading-logo {
            font-size: 2.2rem;
          }

          .invisible-pricing-button {
            left: 42%;
            width: 15%;
            height: 8%;
          }
        }

        /* Mobile Landscape & Small Tablets */
        @media (max-width: 768px) {
          .spline-viewer {
            display: none;
          }

          .mobile-background {
            display: block;
          }

          .mobile-header {
            display: block;
          }

          .slogan-title {
            font-size: 2rem;
          }

          .slogan-subtitle {
            font-size: 0.95rem;
          }

          .desktop-message {
            display: flex;
          }

          .headphone-icon {
            width: 18px;
            height: 18px;
          }

          .desktop-message-text {
            font-size: 0.8rem;
          }

          .button-row {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            bottom: 35%;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            width: auto;
            padding: 0 20px;
          }

          .btn {
            width: 280px;
            font-size: 1rem;
            padding: 1rem 2rem;
            min-height: 56px;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0, 198, 255, 0.4);
          }

          .btn:active {
            transform: scale(0.98);
            box-shadow: 0 2px 8px rgba(0, 198, 255, 0.3);
          }

          .copyright {
            bottom: 20px;
            right: 50%;
            transform: translateX(50%);
            font-size: 0.7rem;
            width: auto;
            height: auto;
            padding: 8px 16px;
            text-align: center;
          }

          .loading-logo {
            font-size: 2rem;
          }

          .loading-text {
            font-size: 1rem;
            text-align: center;
            padding: 0 1rem;
          }

          .invisible-pricing-button {
            display: none;
          }
        }

        /* Mobile Portrait */
        @media (max-width: 480px) {
          .mobile-header {
            padding: 15px;
          }

          .slogan {
            margin-bottom: 12px;
          }

          .slogan-title {
            font-size: 1.7rem;
          }

          .slogan-subtitle {
            font-size: 0.85rem;
          }

          .desktop-message {
            padding: 8px 16px;
            gap: 8px;
          }

          .headphone-icon {
            width: 16px;
            height: 16px;
          }

          .desktop-message-text {
            font-size: 0.75rem;
          }

          .button-row {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            bottom: 32%;
            flex-direction: column;
            align-items: center;
            gap: 1.8rem;
            width: 100%;
            padding: 0 30px;
          }

          .btn {
            width: 100%;
            max-width: 300px;
            font-size: 0.95rem;
            padding: 1.1rem 2rem;
            min-height: 58px;
            border-radius: 50px;
            box-shadow: 0 5px 20px rgba(0, 198, 255, 0.45);
          }

          .btn::after {
            font-size: 1.2rem;
          }

          .btn:active {
            transform: scale(0.97);
          }

          .copyright {
            right: 50%;
            transform: translateX(50%);
            bottom: 15px;
            width: auto;
            height: auto;
            font-size: 0.65rem;
            padding: 8px 14px;
            text-align: center;
          }

          .loading-logo {
            font-size: 1.8rem;
          }

          .loading-spinner {
            width: 50px;
            height: 50px;
          }

          .loading-text {
            font-size: 0.9rem;
            padding: 0 1.5rem;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .button-row {
            bottom: 30%;
            gap: 1.5rem;
            padding: 0 25px;
          }

          .btn {
            width: 100%;
            max-width: 280px;
            font-size: 0.9rem;
            padding: 1rem 1.8rem;
            min-height: 56px;
          }

          .copyright {
            right: 50%;
            transform: translateX(50%);
            bottom: 12px;
            font-size: 0.6rem;
            padding: 6px 12px;
          }

          .loading-logo {
            font-size: 1.6rem;
          }

          .loading-text {
            font-size: 0.85rem;
          }
        }

        /* Landscape Mode for Mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .button-row {
            bottom: 20%;
            gap: 1rem;
            padding: 0 20px;
          }

          .btn {
            padding: 0.8rem 1.5rem;
            font-size: 0.85rem;
            min-height: 48px;
            width: 240px;
          }

          .copyright {
            bottom: 10px;
            font-size: 0.6rem;
            padding: 6px 12px;
          }

          .loading-logo {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            margin-bottom: 0.5rem;
          }

          .loading-text {
            font-size: 0.8rem;
          }
        }
      `}</style>

      {/* Loading Screen */}
      <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
        <div className="loading-logo">AI-Interview</div>
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading your interview experience...</div>
      </div>

      {/* Main Content */}
      <div className={`landing-container main-content`}>
        {/* Fullscreen Spline Background */}
        <spline-viewer
          className="spline-viewer"
          url="https://prod.spline.design/quvdRztMSPYuwcrL/scene.splinecode"
        ></spline-viewer>

        {/* Mobile Background Fallback */}
        <div className="mobile-background"></div>

        {/* Mobile Header - Mobile Only */}
        <div className="mobile-header">
          {/* Slogan */}
          <div className="slogan">
            <h1 className="slogan-title">AI-Interview</h1>
            <p className="slogan-subtitle">Master Your Interview Skills</p>
          </div>

          {/* Desktop Message */}
          <div className="desktop-message">
            <svg 
              className="headphone-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 3C7.58172 3 4 6.58172 4 11V14C4 15.1046 4.89543 16 6 16C7.10457 16 8 15.1046 8 14V12C8 10.8954 7.10457 10 6 10H5C5 7.23858 7.23858 5 10 5H14C16.7614 5 19 7.23858 19 10H18C16.8954 10 16 10.8954 16 12V14C16 15.1046 16.8954 16 18 16C19.1046 16 20 15.1046 20 14V11C20 6.58172 16.4183 3 12 3Z" 
                fill="#00c6ff"
              />
              <path 
                d="M18 18C18 19.1046 17.1046 20 16 20H14" 
                stroke="#00c6ff" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
            <p className="desktop-message-text">For the best experience, use desktop</p>
          </div>
        </div>

        {/* Button Row */}
        <div className="button-row">
          <button className="btn" onClick={handleGetStarted}>
            Let's Get Started
          </button>
          <button className="btn" onClick={handlePricing}>
            Pricing Details
          </button>
        </div>

        {/* Invisible Pricing Button */}
        <button 
          className="invisible-pricing-button"
          onClick={handlePricing}
          aria-label="Navigate to pricing page"
        >
          &nbsp;
        </button>

        {/* Copyright Section */}
        <div className="copyright">
          © AI-Interview Capstone 2025
        </div>
      </div>
    </>
  )
}