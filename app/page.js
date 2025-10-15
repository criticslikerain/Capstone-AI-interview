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
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
          color: #fff;
          background-color: #000;
        }

        .landing-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
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

        @media (max-width: 768px) {
          .button-row {
            left: 8%;
            bottom: 22%;
            flex-direction: column;
          }

          .btn {
            width: 160px;
            font-size: 0.9rem;
            padding: 0.7rem 1.4rem;
          }

          .copyright {
            bottom: 20px;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .button-row {
            left: 5%;
            bottom: 20%;
            align-items: center;
          }

          .btn {
            width: 180px;
            font-size: 0.85rem;
            padding: 0.6rem 1.2rem;
          }

          .copyright {
            right: 5px;
            width: 110px;
            font-size: 0.7rem;
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

        {/* Button Row */}
        <div className="button-row">
          <button className="btn" onClick={handleGetStarted}>
            Let's Get Started
          </button>
          <button className="btn" onClick={handlePricing}>
            Pricing Details
          </button>
        </div>

        {/* Copyright Section */}
        <div className="copyright">
          © AI-Interview Capstone 2025
        </div>
      </div>
    </>
  )
}