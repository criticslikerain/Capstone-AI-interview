import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
import ChatBubbleLogo from '../components/ChatBubbleLogo';

const SetupProfile = ({ onComplete, onSkip }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    elementary: '',
    highSchool: '',
    college: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile setup completed:', formData);
    onComplete(formData);
  };

  const handleSkip = () => {
    console.log('Profile setup skipped');
    onSkip();
  };

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
        display: window.innerWidth >= 1024 ? 'block' : 'none',
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

      {/* Right side - Setup Profile Form */}
      <div style={{
        width: window.innerWidth >= 1024 ? '50%' : '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        margin: 0,
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '2rem'
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
            marginBottom: '2rem'
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Setup Profile
            </h1>
          </div>

          {/* Setup Profile Form */}
          <form onSubmit={handleSubmit} style={{ 
            width: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem' 
          }}>
            {/* Personal Details Section */}
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                Personal Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* First Name */}
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box'
                  }}
                />

                {/* Last Name */}
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box'
                  }}
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box'
                  }}
                />

                {/* Phone Number */}
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box'
                  }}
                />

                {/* Address */}
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Education Section */}
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                Education
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Elementary */}
                <input
                  type="text"
                  name="elementary"
                  value={formData.elementary}
                  onChange={handleChange}
                  placeholder="Elementary"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box'
                  }}
                />

                {/* High School */}
                <input
                  type="text"
                  name="highSchool"
                  value={formData.highSchool}
                  onChange={handleChange}
                  placeholder="Senior High School / High School"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box'
                  }}
                />

                {/* College */}
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="College"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'transparent',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <button
                type="button"
                onClick={handleSkip}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: '1px solid #22d3ee',
                  color: '#06b6d4',
                  backgroundColor: 'transparent',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0fdfa'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Skip
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
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
                Finish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;
