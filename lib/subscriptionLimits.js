import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const PLAN_LIMITS = {
  free: {
    interviews: 5,
    questionBank: 20,
    name: 'Free'
  },
  premium: {
    interviews: -1,
    questionBank: -1,
    name: 'Premium'
  },
  professional: {
    interviews: -1,
    questionBank: -1,
    name: 'Professional'
  }
};

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getUserUsage = async (userId) => {
  try {
    const subDoc = await getDoc(doc(db, 'subscriptions', userId));
    const subscription = subDoc.exists() ? subDoc.data() : { plan: 'free', status: 'active' };
    
    const usageDoc = await getDoc(doc(db, 'usage_tracking', userId));
    const monthKey = getCurrentMonthKey();
    
    if (!usageDoc.exists()) {
      const initialUsage = {
        userId,
        [monthKey]: { interviews: 0, questionBank: 0 },
        lastReset: new Date().toISOString()
      };
      await setDoc(doc(db, 'usage_tracking', userId), initialUsage);
      return {
        subscription,
        usage: { interviews: 0, questionBank: 0 },
        limits: PLAN_LIMITS[subscription.plan] || PLAN_LIMITS.free
      };
    }
    
    const usageData = usageDoc.data();
    const currentUsage = usageData[monthKey] || { interviews: 0, questionBank: 0 };
    
    return {
      subscription,
      usage: currentUsage,
      limits: PLAN_LIMITS[subscription.plan] || PLAN_LIMITS.free
    };
  } catch (error) {
    console.error('Error getting user usage:', error);
    return {
      subscription: { plan: 'free', status: 'active' },
      usage: { interviews: 0, questionBank: 0 },
      limits: PLAN_LIMITS.free
    };
  }
};

export const canStartInterview = async (userId) => {
  const { usage, limits } = await getUserUsage(userId);
  
  if (limits.interviews === -1) return { allowed: true, remaining: -1 };
  
  const remaining = limits.interviews - usage.interviews;
  return {
    allowed: remaining > 0,
    remaining,
    used: usage.interviews,
    limit: limits.interviews
  };
};

export const canAnswerQuestion = async (userId) => {
  const { usage, limits } = await getUserUsage(userId);
  
  if (limits.questionBank === -1) return { allowed: true, remaining: -1 };
  
  const remaining = limits.questionBank - usage.questionBank;
  return {
    allowed: remaining > 0,
    remaining,
    used: usage.questionBank,
    limit: limits.questionBank
  };
};

export const incrementInterviewCount = async (userId) => {
  try {
    const monthKey = getCurrentMonthKey();
    const usageRef = doc(db, 'usage_tracking', userId);
    const usageDoc = await getDoc(usageRef);
    
    if (!usageDoc.exists()) {
      await setDoc(usageRef, {
        userId,
        [monthKey]: { interviews: 1, questionBank: 0 },
        lastReset: new Date().toISOString()
      });
    } else {
      const data = usageDoc.data();
      const currentMonth = data[monthKey] || { interviews: 0, questionBank: 0 };
      
      await updateDoc(usageRef, {
        [`${monthKey}.interviews`]: currentMonth.interviews + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing interview count:', error);
  }
};

export const incrementQuestionCount = async (userId) => {
  try {
    const monthKey = getCurrentMonthKey();
    const usageRef = doc(db, 'usage_tracking', userId);
    const usageDoc = await getDoc(usageRef);
    
    if (!usageDoc.exists()) {
      await setDoc(usageRef, {
        userId,
        [monthKey]: { interviews: 0, questionBank: 1 },
        lastReset: new Date().toISOString()
      });
    } else {
      const data = usageDoc.data();
      const currentMonth = data[monthKey] || { interviews: 0, questionBank: 0 };
      
      await updateDoc(usageRef, {
        [`${monthKey}.questionBank`]: currentMonth.questionBank + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing question count:', error);
  }
};
