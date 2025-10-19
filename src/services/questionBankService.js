import { db } from '../../lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const API_ENDPOINTS = {
  behavioral: 'https://behavioral-question-api.netlify.app/.netlify/functions/behavioral-questions',
  technical: 'https://behavioral-question-api.netlify.app/.netlify/functions/technical-questions',
  'problem-solving': 'https://behavioral-question-api.netlify.app/.netlify/functions/problem-solving-questions'
};

const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export const fetchQuestionsFromAPI = async (category) => {
  const response = await fetch(API_ENDPOINTS[category]);
  const data = await response.json();
  return {
    batchId: data.batchId,
    category: data.category,
    questions: data.questions.slice(0, 5),
    fetchDate: getTodayDate()
  };
};

export const shouldRefetchQuestions = (userData) => {
  if (!userData || !userData.fetchDate) return true;
  const allAnswered = userData.questions?.every((_, idx) => userData.answers?.[idx]?.answeredAt);
  if (!allAnswered) return false;
  return userData.fetchDate !== getTodayDate();
};

export const getUserQuestionData = async (userId, category) => {
  const docRef = doc(db, 'user_questions', `${userId}_${category}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const saveUserQuestionData = async (userId, category, data) => {
  const docRef = doc(db, 'user_questions', `${userId}_${category}`);
  await setDoc(docRef, {
    userId,
    category,
    ...data,
    updatedAt: new Date()
  }, { merge: true });
};

export const initializeUserQuestionData = async (userId, category, data) => {
  const docRef = doc(db, 'user_questions', `${userId}_${category}`);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    await setDoc(docRef, {
      userId,
      category,
      ...data,
      answers: {},
      updatedAt: new Date()
    });
  }
};

export const saveUserAnswer = async (userId, category, questionIndex, answer) => {
  const docRef = doc(db, 'user_questions', `${userId}_${category}`);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    const answers = data.answers || {};
    answers[questionIndex] = {
      answer,
      answeredAt: new Date(),
      analyzed: false
    };
    
    await updateDoc(docRef, { answers, updatedAt: new Date() });
  }
};

export const saveAIAnalysis = async (userId, category, questionIndex, analysis) => {
  const docRef = doc(db, 'user_questions', `${userId}_${category}`);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    const answers = data.answers || {};
    if (answers[questionIndex]) {
      answers[questionIndex].analysis = analysis;
      answers[questionIndex].analyzed = true;
      answers[questionIndex].analyzedAt = new Date();
    }
    
    await updateDoc(docRef, { answers, updatedAt: new Date() });
  }
};
