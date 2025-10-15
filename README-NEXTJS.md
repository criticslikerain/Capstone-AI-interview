# InterviewPro - Next.js Full-Stack Implementation

This is the Next.js full-stack version of InterviewPro with MariaDB backend integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MariaDB server running
- Database: `capstone_interview`
- User: `root` with password: `lms2026`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   ```bash
   npm run db:setup
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Full-Stack Structure
```
app/
├── api/                    # API Routes (Backend)
│   ├── auth/              # Authentication endpoints
│   ├── interviews/        # Interview session management
│   └── questions/         # Question bank APIs
├── login/                 # Login page
├── signup/                # Registration page
├── user-dashboard/        # User dashboard
└── layout.js             # Root layout

lib/
└── db.js                 # Database connection utility

database/
├── schema.sql            # MariaDB schema
└── setup.js             # Database setup script
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout

#### Interview Sessions
- `GET /api/interviews/sessions` - Get user sessions
- `POST /api/interviews/sessions` - Create new session

#### Questions
- `GET /api/questions/categories` - Get question categories

## 🗄️ Database

### MariaDB Configuration
- **Host:** localhost:3306
- **Database:** capstone_interview
- **User:** root
- **Password:** lms2026

### Key Tables
- `users` - User accounts and profiles
- `interview_sessions` - Interview practice sessions
- `interview_questions` - Question bank
- `question_categories` - Question organization
- `user_subscriptions` - Subscription management

## 🔐 Authentication

- **JWT-based authentication** with HTTP-only cookies
- **Protected routes** with middleware
- **Password hashing** with bcryptjs
- **Session management** with automatic token refresh

## 🎨 Frontend Features

- **Next.js 15** with App Router
- **Tailwind CSS** for styling
- **Lucide React** icons
- **Responsive design** for all devices
- **Client-side routing** with authentication guards

## 🔧 Environment Variables

Create `.env.local` with:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=capstone_interview
DB_USER=root
DB_PASSWORD=lms2026
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
```

## 📝 Development Workflow

1. **Database Changes:**
   - Modify `database/schema.sql`
   - Run `npm run db:setup`

2. **API Development:**
   - Add routes in `app/api/`
   - Use `lib/db.js` for database queries

3. **Frontend Development:**
   - Add pages in `app/`
   - Use Tailwind for styling

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- Set production environment variables
- Configure MariaDB for production
- Update NEXTAUTH_URL for your domain

## 🔄 Migration from React

### What Changed
- **Vite → Next.js:** Build system and routing
- **Client-side routing → App Router:** File-based routing
- **Separate backend → API Routes:** Integrated backend
- **PostgreSQL → MariaDB:** Database system
- **Express server → Next.js API:** Server architecture

### Benefits
- **Full-stack in one codebase**
- **Built-in API routes**
- **Automatic code splitting**
- **Server-side rendering**
- **Better SEO and performance**
- **Simplified deployment**

## 📊 Features Implemented

✅ User authentication (login/register/logout)  
✅ JWT-based session management  
✅ User dashboard with statistics  
✅ Interview session tracking  
✅ Database integration with MariaDB  
✅ Responsive UI with Tailwind CSS  
✅ Protected routes with middleware  

## 🔜 Next Steps

- Implement interview question management
- Add AI feedback integration
- Create performance analytics
- Build subscription management
- Add email verification
- Implement file upload for profiles

---

**InterviewPro Next.js** - Full-stack interview practice platform with integrated backend and MariaDB database.