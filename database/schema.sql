--*********************************************************
--*  SCHEMA SA INTERVIEWPRO APP! ^____^
--* Gi convert ni from PostgreSQL to MariaDB para Next.js
--* 
--* NOTE: AYAW KAAYO HILABTI KUNG DILI KA EXPERT!
--*********************************************************

--*********************************************************
--* USERS AND AUTH TABLES DIRI TANAN!!!
--* Diri nato i-store ang user info ug authentication
--* Ay pagdula2x diri ha! Sensitibo kaayo ning data!
--*********************************************************

--******************************************************
--* MAIN USERS TABLE NI SHA!!! CROWN JEWEL BA! 
--* Diri tanan information sa users nato gi butang
--* UUID gamit para unique ID, dili predictable XD
--******************************************************
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_picture_url TEXT,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    user_type ENUM('user', 'admin', 'premium') DEFAULT 'user',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--******************************************************
--* EMAIL VERIFICATION TOKENS DIRI!!!
--* Para verify nga dili fake ang email 
--* Ma expire ni after X hours, so di kaayo dugay!
--******************************************************
CREATE TABLE email_verification_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE password_reset_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================
-- SUBSCRIPTION AND BILLING TABLES
-- ==============================================

CREATE TABLE subscription_plans (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_cycle ENUM('monthly', 'yearly', 'lifetime') NOT NULL,
    features JSON,
    max_interviews_per_month INT,
    max_ai_feedback_sessions INT,
    priority_support BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(36) NOT NULL,
    status ENUM('active', 'cancelled', 'expired', 'pending') DEFAULT 'active',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- ==============================================
-- QUESTION BANK TABLES
-- ==============================================

CREATE TABLE question_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(20),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interview_questions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category_id VARCHAR(36) NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('behavioral', 'technical', 'situational', 'general') DEFAULT 'behavioral',
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    industry VARCHAR(100),
    job_role VARCHAR(100),
    tags JSON,
    sample_answer TEXT,
    tips JSON,
    time_limit_seconds INT DEFAULT 180,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES question_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ==============================================
-- INTERVIEW SESSIONS TABLES
-- ==============================================

CREATE TABLE interview_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    session_name VARCHAR(255),
    interview_type ENUM('full', 'behavioral', 'technical', 'situational') DEFAULT 'full',
    job_role VARCHAR(100),
    company_name VARCHAR(255),
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    scheduled_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    total_duration_seconds INT,
    overall_score DECIMAL(4, 2),
    feedback_summary TEXT,
    strengths JSON,
    weaknesses JSON,
    improvement_suggestions JSON,
    session_metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE interview_session_questions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    question_order INT NOT NULL,
    asked_at TIMESTAMP NULL,
    answered_at TIMESTAMP NULL,
    time_taken_seconds INT,
    user_answer TEXT,
    audio_response_url TEXT,
    video_response_url TEXT,
    score DECIMAL(4, 2),
    ai_feedback TEXT,
    strengths JSON,
    improvement_areas JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES interview_questions(id)
);

-- ==============================================
-- PERFORMANCE ANALYTICS TABLES
-- ==============================================

CREATE TABLE user_performance_metrics (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    metric_date DATE NOT NULL,
    total_interviews INT DEFAULT 0,
    completed_interviews INT DEFAULT 0,
    average_score DECIMAL(4, 2),
    total_practice_time_minutes INT DEFAULT 0,
    improvement_rate DECIMAL(4, 2),
    strong_categories JSON,
    weak_categories JSON,
    goals_achieved INT DEFAULT 0,
    goals_total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, metric_date)
);

-- ==============================================
-- NOTIFICATIONS TABLE
-- ==============================================

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_status ON interview_sessions(status);
CREATE INDEX idx_interview_questions_category_id ON interview_questions(category_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ==============================================
-- SAMPLE DATA
-- ==============================================

INSERT INTO subscription_plans (name, description, price, billing_cycle, features, max_interviews_per_month, max_ai_feedback_sessions, priority_support) VALUES
('Free Trial', 'Get started with basic interview practice', 0.00, 'monthly', '["5 practice interviews per month", "Basic AI feedback", "Question bank access", "Email support"]', 5, 5, false),
('Professional', 'Perfect for serious job seekers', 19.99, 'monthly', '["Unlimited interviews", "Advanced AI feedback", "Performance analytics", "Full question bank", "Email support"]', -1, -1, false),
('Premium', 'Advanced features for professional candidates', 39.99, 'monthly', '["Everything in Professional", "Priority support", "Mock video interviews", "Custom question sets", "Career coaching sessions"]', -1, -1, true);

INSERT INTO question_categories (name, description, icon, color, sort_order) VALUES
('Behavioral', 'Questions about past experiences and behavior', 'user', '#3B82F6', 1),
('Technical', 'Technical skills assessment and knowledge check', 'code', '#10B981', 2),
('Situational', 'Hypothetical scenarios and problem-solving', 'lightbulb', '#F59E0B', 3),
('Leadership', 'Leadership and management capabilities', 'users', '#8B5CF6', 4),
('Communication', 'Communication and interpersonal skills', 'message-circle', '#EC4899', 5);

INSERT INTO interview_questions (category_id, question_text, question_type, difficulty_level, industry, job_role, tags, sample_answer, tips, time_limit_seconds) VALUES
((SELECT id FROM question_categories WHERE name = 'Behavioral'), 'Tell me about a time when you had to work with a difficult team member.', 'behavioral', 'medium', 'General', 'General', '["teamwork", "conflict resolution", "interpersonal skills"]', 'I once worked with a colleague who consistently missed deadlines...', '["Use the STAR method", "Focus on your specific actions", "Highlight the positive outcome"]', 180),
((SELECT id FROM question_categories WHERE name = 'Technical'), 'Explain the difference between SQL JOINs with examples.', 'technical', 'medium', 'Technology', 'Software Developer', '["sql", "database", "programming"]', 'SQL JOINs are used to combine data from multiple tables...', '["Provide concrete examples", "Draw simple diagrams if possible", "Mention performance considerations"]', 240);