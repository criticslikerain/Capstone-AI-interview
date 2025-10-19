import { API_CONFIG } from '../config/apiConfig';

export const analyzeAnswer = async (question, answer) => {
  const prompt = `Analyze this interview answer objectively and thoroughly:

Question: ${question}
Answer: ${answer}

Provide a comprehensive, unbiased analysis covering:
1. Score: Rate from 1-10 with justification
2. Content Quality: Evaluate the substance and relevance of the answer
3. Structure: Assess how well-organized the response is
4. Strengths: Identify specific positive aspects
5. Areas for Improvement: Point out what could be enhanced
6. Actionable Recommendations: Provide specific steps to improve

Be honest, constructive, and specific in your feedback.`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || process.env.HUGGING_FACE_API_KEY || API_CONFIG.HUGGING_FACE_API_KEY;
    
    const response = await fetch(API_CONFIG.HUGGING_FACE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.HUGGING_FACE_MODEL,
        messages: [
          { role: 'system', content: 'You are an expert interview coach providing honest, unbiased, and constructive feedback on candidate responses. Always start with a score out of 10. Be thorough and specific in your analysis.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Analysis completed. Your answer shows good understanding.';
  } catch (error) {
    console.error('AI Analysis error:', error);
    return 'AI analysis is temporarily unavailable. Please try again later.';
  }
};
