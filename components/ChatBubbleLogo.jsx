import React from 'react';

const ChatBubbleLogo = ({ size = 64 }) => {
  const scale = size / 64; // Base size kay 64px man, bai
  
  return (
    <div style={{
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Background Chat Bubble (darker blue) - background nga bubble */}
      <div style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size * 0.75}px`,
        backgroundColor: '#1e40af',
        borderRadius: `${size * 0.3}px`,
        top: `${size * 0.05}px`,
        left: `${size * 0.05}px`,
        opacity: 0.7
      }}>
        {/* Tail of background bubble - ikog sa bubble */}
        <div style={{
          position: 'absolute',
          bottom: `${-size * 0.15}px`,
          left: `${size * 0.15}px`,
          width: 0,
          height: 0,
          borderLeft: `${size * 0.12}px solid transparent`,
          borderRight: `${size * 0.12}px solid transparent`,
          borderTop: `${size * 0.15}px solid #1e40af`,
          opacity: 0.7
        }}></div>
      </div>

      {/* Main Chat Bubble (cyan) - main nga bubble */}
      <div style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size * 0.75}px`,
        backgroundColor: '#06b6d4',
        borderRadius: `${size * 0.3}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 ${size * 0.08}px ${size * 0.25}px rgba(6, 182, 212, 0.3)`
      }}>
        {/* Tail of main bubble - ikog sa main bubble */}
        <div style={{
          position: 'absolute',
          bottom: `${-size * 0.15}px`,
          left: `${size * 0.2}px`,
          width: 0,
          height: 0,
          borderLeft: `${size * 0.12}px solid transparent`,
          borderRight: `${size * 0.12}px solid transparent`,
          borderTop: `${size * 0.15}px solid #06b6d4`
        }}></div>

        {/* Robot/AI Icon - robot nga icon, nindot */}
        <div style={{
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg 
            width={size * 0.5} 
            height={size * 0.5} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            {/* Robot head - ulo sa robot */}
            <rect x="4" y="8" width="16" height="12" rx="2" ry="2" />
            {/* Robot antenna - antenna sa robot */}
            <path d="M12 2v6" />
            <circle cx="12" cy="2" r="1" />
            {/* Robot eyes - mata sa robot */}
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
            {/* Robot mouth - baba sa robot */}
            <path d="M9 16h6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ChatBubbleLogo;