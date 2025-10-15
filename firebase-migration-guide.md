# Firebase Migration Guide - InterviewPro

## Migration Status ✅

### Completed API Route Migrations

1. **Authentication Routes**
   - ✅ `/api/auth/login/route.js` - Migrated to Firebase
   - ✅ `/api/auth/register/route.js` - Migrated to Firebase  
   - ✅ `/api/auth/forgot-password/route.js` - Migrated to Firebase
   - ✅ `/api/auth/reset-password/route.js` - Migrated to Firebase

2. **Admin Routes**
   - ✅ `/api/admin/users/route.js` - Migrated to Firebase

3. **Interview Routes**
   - ✅ `/api/interviews/sessions/route.js` - Migrated to Firebase
   - ✅ `/api/interviews/analyze/route.js` - Migrated to Firebase

4. **Question Routes**
   - ✅ `/api/questions/categories/route.js` - Migrated to Firebase

### Remaining Routes to Migrate

1. **Google OAuth Route**
   - `/api/auth/google/route.js` - Needs Firebase Auth integration

## Next Steps

### 1. Install Firebase Dependencies

```bash
npm install firebase
```

### 2. Set Up Environment Variables

Add to `.env.local`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Initialize Firestore Collections

Run this script to create initial data:

```javascript
// scripts/init-firestore.js
import { db } from '../src/lib/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const initializeCategories = async () => {
  const categories = [
    {
      name: "Behavioral",
      description: "Questions about past experiences and behavior",
      icon: "user",
      color: "#3B82F6",
      sort_order: 1,
      is_active: true
    },
    {
      name: "Technical",
      description: "Technical skills and knowledge questions",
      icon: "code",
      color: "#10B981",
      sort_order: 2,
      is_active: true
    },
    {
      name: "Situational",
      description: "Hypothetical scenario-based questions",
      icon: "lightbulb",
      color: "#F59E0B",
      sort_order: 3,
      is_active: true
    }
  ];

  for (const category of categories) {
    await addDoc(collection(db, 'question_categories'), category);
  }
};

initializeCategories();
```

### 4. Update Frontend Components

Replace any direct database calls in React components with Firebase SDK calls:

```javascript
// Before
const response = await fetch('/api/auth/login', { ... });

// After - still works, API routes now use Firebase
const response = await fetch('/api/auth/login', { ... });
```

### 5. Test All Functionality

- [ ] User registration
- [ ] User login
- [ ] Password reset flow
- [ ] Admin dashboard
- [ ] Interview sessions
- [ ] Question categories
- [ ] Interview analysis

### 6. Deploy Firebase Security Rules

Update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.user_type == 'admin';
    }
    
    match /question_categories/{document} {
      allow read: if true;
    }
    
    match /interview_sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.user_id == request.auth.uid;
    }
    
    match /password_reset_tokens/{document} {
      allow read, write: if false; // Only server-side access
    }
    
    match /interviews/{document} {
      allow read, write: if false; // Only server-side access
    }
  }
}
```

## Key Changes Made

### Database Operations
- Replaced `query()` function with Firebase Firestore operations
- Converted SQL queries to Firestore queries with `where()`, `orderBy()`, `limit()`
- Changed `INSERT` operations to `addDoc()`
- Changed `UPDATE` operations to `updateDoc()`
- Changed `SELECT` operations to `getDocs()` and `getDoc()`

### Data Structure Changes
- MySQL auto-increment IDs → Firestore document IDs
- MySQL timestamps → JavaScript Date objects
- Relational joins → Denormalized document structure

### Authentication
- Kept existing JWT system (can migrate to Firebase Auth later)
- Password hashing remains the same with bcrypt
- Token validation unchanged

## Benefits of Migration

1. **Scalability** - Firestore scales automatically
2. **Real-time** - Built-in real-time updates
3. **Security** - Robust security rules
4. **Maintenance** - No database server management
5. **Integration** - Easy integration with other Firebase services

## Optional: Migrate to Firebase Authentication

For even better integration, consider migrating from JWT to Firebase Auth:

```javascript
// Replace JWT with Firebase Auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase.js';

// Login
const userCredential = await signInWithEmailAndPassword(auth, email, password);

// Register  
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
```

This would eliminate the need for custom JWT handling and password reset tokens.