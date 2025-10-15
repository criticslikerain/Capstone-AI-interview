import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase Config:', firebaseConfig);

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('Firebase Auth:', auth);
console.log('Firebase DB:', db);


let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };


export const getUserByEmail = async (email) => {
  const q = query(collection(db, 'users'), where('email', '==', email), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const createUser = async (userData) => {
  const docRef = await addDoc(collection(db, 'users'), {
    ...userData,
    created_at: new Date(),
    updated_at: new Date()
  });
  return { id: docRef.id, ...userData };
};

export const updateUser = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...userData,
    updated_at: new Date()
  });
};

export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createPasswordResetToken = async (tokenData) => {
  const docRef = await addDoc(collection(db, 'password_reset_tokens'), {
    ...tokenData,
    created_at: new Date()
  });
  return { id: docRef.id, ...tokenData };
};

export const getPasswordResetToken = async (token) => {
  const q = query(
    collection(db, 'password_reset_tokens'), 
    where('token', '==', token),
    where('is_used', '==', false),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  const data = doc.data();
  
  // Check if token is expired
  if (data.expires_at.toDate() < new Date()) return null;
  
  return { id: doc.id, ...data };
};

export const markTokenAsUsed = async (tokenId) => {
  const tokenRef = doc(db, 'password_reset_tokens', tokenId);
  await updateDoc(tokenRef, { is_used: true });
};

export const getInterviewSessions = async (userId) => {
  const q = query(
    collection(db, 'interview_sessions'),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createInterviewSession = async (sessionData) => {
  const docRef = await addDoc(collection(db, 'interview_sessions'), {
    ...sessionData,
    created_at: new Date()
  });
  return { id: docRef.id, ...sessionData };
};

export const getQuestionCategories = async () => {
  const q = query(
    collection(db, 'question_categories'),
    where('is_active', '==', true),
    orderBy('sort_order')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createInterview = async (interviewData) => {
  const docRef = await addDoc(collection(db, 'interviews'), {
    ...interviewData,
    created_at: new Date()
  });
  return { id: docRef.id, ...interviewData };
};

