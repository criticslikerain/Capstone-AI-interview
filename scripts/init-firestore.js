import { db } from '../lib/firebase.js';
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

  console.log('Initializing Firestore collections...');
  
  for (const category of categories) {
    try {
      await addDoc(collection(db, 'question_categories'), category);
      console.log(`Added category: ${category.name}`);
    } catch (error) {
      console.error(`Error adding category ${category.name}:`, error);
    }
  }
  
  console.log('Firestore initialization complete!');
};

initializeCategories().catch(console.error);