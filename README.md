React-based platform designed for AI-powered mock interviews, performance analysis, and personalized coaching.

Features
Authentication System

User login and registration

Password recovery

Email verification

Profile setup

Dashboard and Analytics

Admin dashboard for management

User dashboard with performance overview

Weakness analysis and improvement recommendations

Interview history and statistics

Interview System

Live AI interview setup and configuration

Voice-based interview sessions

Real-time feedback and scoring

Multiple interview types (Behavioral, Technical, Situational)

Content Management

Question bank with categorized questions

Personalized coaching recommendations

Performance tracking and analytics

Account Management

User profile management

Subscription plans and billing

Application settings and preferences

Pricing and plan selection

Tech Stack

Frontend: React 19.1.1

Routing: React Router DOM 7.8.0

Icons: Lucide React 0.539.0

Build Tool: Vite 7.1.0

Styling: Custom CSS with modern design patterns

Installation

Clone the repository.

Install dependencies:

npm install


Start the development server:

npm run dev


Open http://localhost:3000
 in your browser.

Deployment
Netlify Deployment

Build the project:

npm run build


Deploy to Netlify:

Connect the repository to Netlify

Build command: npm run build

Publish directory: dist

The netlify.toml and _redirects files are already configured

Manual Deployment

Build the project: npm run build

Upload the dist folder to your hosting provider

Configure your server to serve index.html for all routes (SPA routing)

Available Routes
Authentication

/login – User login

/signup – User registration

/forgot-password – Password recovery

/email-verification – Email verification

/setup-profile – Profile setup

Dashboards

/dashboard – Admin dashboard

/user-dashboard – User dashboard

Interview System

/live-ai-interview – Interview setup

/voice-interview – Voice interview session

/interview-results – Interview results

Analysis and Content

/weakness-overview – Performance analysis

/question-bank – Question repository

Account Management

/profile – User profile

/my-plan – Subscription management

/pricing – Pricing plans

/settings – Application settings

Utility

/categories – Site navigation overview

Design Features

Responsive design for desktop, tablet, and mobile

Modern, professional user interface

Consistent branding across the platform

Smooth animations and interactive elements

Accessibility with proper contrast and semantic HTML

Configuration
Environment Variables

No environment variables are required for this prototype.

Build Configuration

Output directory: dist

Asset optimization enabled

Code splitting configured for optimal loading

Source maps disabled for production

Performance

Optimized bundle with code splitting

Asset optimization for faster loading

Modern ES6+ build using Vite

Lazy loading for components

Contributing

This is a prototype application. For production use, consider adding:

A backend for authentication

Real AI interview functionality

Database integration

Comprehensive error handling

Automated testing

License

This project is a prototype created for demonstration purposes.

Quick Start for Development

Visit /categories to view all available routes

Begin with /login for the authentication flow

Use /user-dashboard as the main user interface

Explore /live-ai-interview to test the interview system
