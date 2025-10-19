import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import SignUp from './pages/SignUp';
import EmailVerification from './pages/EmailVerification';
import SetupProfile from './pages/SetupProfile';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import LiveAIInterview from './pages/LiveAIInterview';
import LiveAIInterviewContentPage from './pages/LiveAIInterviewContentPage';
import VoiceInterview from './pages/VoiceInterview';
import InterviewResults from './pages/InterviewResults';
import WeaknessOverview from './pages/WeaknessOverview';
import MyPlan from './pages/MyPlan';
import SettingsPage from './pages/SettingsPage';
import QuestionBank from './pages/QuestionBank';
import ProfilePage from './pages/ProfilePage';
import PricingPage from './pages/PricingPage';
import CategoriesPage from './pages/CategoriesPage';
import ResetPassword from './pages/ResetPassword';

// Wrapper components to handle navigation
const LoginWrapper = () => {
  const navigate = useNavigate();
  return (
    <Login
      onForgotPassword={() => navigate('/forgot-password')}
      onSignUp={() => navigate('/signup')}
    />
  );
};

const ForgotPasswordWrapper = () => {
  const navigate = useNavigate();
  return (
    <ForgotPassword onBackToLogin={() => navigate('/login')} />
  );
};

const SignUpWrapper = () => {
  const navigate = useNavigate();
  return (
    <SignUp
      onBackToLogin={() => navigate('/login')}
      onSignUpSuccess={(email) => {
        sessionStorage.setItem('userEmail', email);
        navigate('/email-verification');
      }}
    />
  );
};

const EmailVerificationWrapper = () => {
  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('userEmail') || '';

  return (
    <EmailVerification
      onProceed={() => {
        console.log('Email verification completed, redirecting to profile setup...');
        navigate('/setup-profile');
      }}
      userEmail={userEmail}
    />
  );
};

const SetupProfileWrapper = () => {
  const navigate = useNavigate();

  return (
    <SetupProfile
      onComplete={(profileData) => {
        console.log('Profile setup completed:', profileData);
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userType', 'user');
        navigate('/user-dashboard');
      }}
      onSkip={() => {
        console.log('Profile setup skipped');
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userType', 'user');
        navigate('/user-dashboard');
      }}
    />
  );
};

const DashboardWrapper = () => {
  const navigate = useNavigate();

  return (
    <Dashboard
      onLogout={() => {
        console.log('Admin logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const UserDashboardWrapper = () => {
  const navigate = useNavigate();

  return (
    <UserDashboard
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const LiveAIInterviewContentPageWrapper = () => {
  const navigate = useNavigate();

  return (
    <LiveAIInterviewContentPage
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const LiveAIInterviewWrapper = () => {
  const navigate = useNavigate();

  return (
    <LiveAIInterview
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const VoiceInterviewWrapper = () => {
  const navigate = useNavigate();

  return (
    <VoiceInterview
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const InterviewResultsWrapper = () => {
  const navigate = useNavigate();

  return (
    <InterviewResults
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const WeaknessOverviewWrapper = () => {
  const navigate = useNavigate();

  return (
    <WeaknessOverview
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const MyPlanWrapper = () => {
  const navigate = useNavigate();

  return (
    <MyPlan
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const SettingsPageWrapper = () => {
  const navigate = useNavigate();

  return (
    <SettingsPage
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const QuestionBankWrapper = () => {
  const navigate = useNavigate();

  return (
    <QuestionBank
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const ProfilePageWrapper = () => {
  const navigate = useNavigate();

  return (
    <ProfilePage
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

const PricingPageWrapper = () => {
  const navigate = useNavigate();

  return (
    <PricingPage
      onLogout={() => {
        console.log('User logged out');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userType');
        navigate('/login');
      }}
    />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignUpWrapper />} />
        <Route path="/forgot-password" element={<ForgotPasswordWrapper />} />
        <Route path="/email-verification" element={<EmailVerificationWrapper />} />
        <Route path="/setup-profile" element={<SetupProfileWrapper />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/user-dashboard" element={<UserDashboardWrapper />} />
        <Route path="/live-ai-interview-content-page" element={<LiveAIInterviewContentPageWrapper />} />
        <Route path="/live-ai-interview" element={<LiveAIInterviewWrapper />} />
        <Route path="/voice-interview" element={<VoiceInterviewWrapper />} />
        <Route path="/interview-results" element={<InterviewResultsWrapper />} />
        <Route path="/weakness-overview" element={<WeaknessOverviewWrapper />} />
        <Route path="/my-plan" element={<MyPlanWrapper />} />
        <Route path="/settings" element={<SettingsPageWrapper />} />
        <Route path="/question-bank" element={<QuestionBankWrapper />} />
        <Route path="/profile" element={<ProfilePageWrapper />} />
        <Route path="/pricing" element={<PricingPageWrapper />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
