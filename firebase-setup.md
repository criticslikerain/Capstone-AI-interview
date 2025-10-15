# Firebase Setup Guide for InterviewPro

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `interviewpro-ai`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Required Services

### Authentication
1. Go to Authentication → Sign-in method
2. Enable Email/Password
3. Enable Google (optional)
4. Configure authorized domains

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select location (closest to your users)

### Storage (if needed for file uploads)
1. Go to Storage
2. Click "Get started"
3. Choose security rules

## Step 3: Install Firebase SDK

```bash
npm install firebase
```

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web" icon
4. Register app name: `InterviewPro`
5. Copy the config object

## Step 5: Create Environment Variables

Create `.env.local`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 6: Initialize Firebase in Project

Create `src/lib/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Step 7: Set Up Firestore Security Rules

In Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.user_type == 'admin';
    }
    
    // Public read for categories and questions
    match /question_categories/{document} {
      allow read: if true;
    }
    
    match /interview_questions/{document} {
      allow read: if true;
    }
    
    // Users can manage their own sessions
    match /interview_sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.user_id == request.auth.uid;
    }
  }
}
```

## Step 8: Create Firestore Collections Structure

### Users Collection
```javascript
// users/{userId}
{
  email: "user@example.com",
  first_name: "John",
  last_name: "Doe",
  user_type: "user", // or "admin"
  is_active: true,
  is_email_verified: false,
  profile_picture_url: "",
  created_at: timestamp,
  last_login: timestamp,
  updated_at: timestamp
}
```

### Question Categories Collection
```javascript
// question_categories/{categoryId}
{
  name: "Behavioral",
  description: "Questions about past experiences",
  icon: "user",
  color: "#3B82F6",
  sort_order: 1,
  is_active: true
}
```

### Interview Sessions Collection
```javascript
// interview_sessions/{sessionId}
{
  user_id: "userId",
  session_name: "Mock Interview 1",
  interview_type: "behavioral",
  job_role: "Software Engineer",
  company_name: "Tech Corp",
  difficulty_level: "intermediate",
  status: "scheduled", // scheduled, in_progress, completed
  overall_score: 85,
  completed_at: timestamp,
  created_at: timestamp
}
```

## Step 9: Migration Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Environment variables configured
- [ ] Firebase SDK installed
- [ ] Firebase initialized in project
- [ ] Security rules configured
- [ ] Collections structure planned
- [ ] API routes ready for migration

## Next Steps

1. Migrate authentication system to Firebase Auth
2. Replace MySQL queries with Firestore operations
3. Update API routes to use Firebase
4. Test all functionality
5. Deploy with Firebase Hosting (optional)