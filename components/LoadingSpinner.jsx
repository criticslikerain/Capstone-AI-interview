import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1.5rem'
        }}>
          InterviewPro
        </h1>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Loading spinner */}
          <div style={{
            width: '3rem',
            height: '3rem',
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: '#dbeafe #dbeafe #3b82f6 #dbeafe', // border-top is blue
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{
            color: '#6b7280',
            fontSize: '1.125rem'
          }}>
            {message}
          </p>
        </div>
      </div>
      
      {/* Add CSS animation for the spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;