import { NextResponse } from 'next/server'
import { createInterview } from '../../../../lib/firebase.js'

export async function POST(request) {
  try {
    const { conversation, userId } = await request.json()

   





    

    // tig analyze sa AI kung unsa ang performance kapoy nag copy paste sa template comments yawaa :)) gora! 
  
    const conversationText = conversation
      .map(msg => `${msg.type === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.text}`)
      .join('\n\n')

    const analysisPrompt = `Analyze this job interview conversation and provide unbiased feedback:

${conversationText}
Provide analysis in this JSON format:
{
  "overallScore": 75,
  "communicationScore": 78,
  "confidenceScore": 82,
  "relevanceScore": 85,
  "overallFeedback": "Brief overall assessment",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "detailedAnalysis": "Detailed paragraph analysis",
  "recommendations": ["rec1", "rec2", "rec3", "rec4"]
}`
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3.1",
        messages: [
          { role: "system", content: "You are an expert interview analyst. Provide unbiased, constructive feedback in the exact JSON format requested." },
          { role: "user", content: analysisPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    })

    let analysis
    if (response.ok) {
      const data = await response.json()
      try {
        analysis = JSON.parse(data.choices[0].message.content)
      } catch {
        analysis = generateFallbackAnalysis(conversation)
      }
    } else {
      analysis = generateFallbackAnalysis(conversation)
    }
    await saveInterviewToDatabase(conversation, analysis, userId)

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed', analysis: generateFallbackAnalysis([]) },
      { status: 500 }
    )
  }
}

function generateFallbackAnalysis(conversation) {
  const responseCount = conversation.filter(msg => msg.type === 'user').length
  const avgResponseLength = conversation
    .filter(msg => msg.type === 'user')
    .reduce((acc, msg) => acc + msg.text.length, 0) / Math.max(responseCount, 1)

  return {
    overallScore: Math.min(75 + (responseCount * 3) + (avgResponseLength > 50 ? 10 : 0), 95),
    communicationScore: avgResponseLength > 30 ? 80 : 65,
    confidenceScore: responseCount >= 5 ? 85 : 70,
    relevanceScore: 78,
    overallFeedback: "Good interview performance with clear communication",
    strengths: [
      "Participated actively in the interview",
      "Provided responses to questions",
      "Maintained professional demeanor"
    ],
    improvements: [
      "Provide more detailed examples",
      "Elaborate on specific experiences",
      "Show more enthusiasm for the role"
    ],
    detailedAnalysis: "Your interview showed good engagement and communication skills. You responded to questions appropriately and maintained a professional tone throughout. To improve, consider providing more specific examples and demonstrating greater enthusiasm for the position.",
    recommendations: [
      "Practice the STAR method for behavioral questions",
      "Prepare specific examples from your experience",
      "Research the company and role thoroughly",
      "Work on projecting confidence and enthusiasm"
    ]
  }
}
async function saveInterviewToDatabase(conversation, analysis, userId) {
  try {
    const interviewConfig = conversation[0]?.interviewConfig || {}
    
    const categoryMap = {
      'software-engineering': 'Software Engineering',
      'web-development': 'Web Development',
      'data-science': 'Data Science & Analytics',
      'business-management': 'Business Management',
      'accounting-finance': 'Accounting & Finance',
      'healthcare-medical': 'Healthcare & Medical',
      'marketing-sales': 'Marketing & Sales',
      'database-administration': 'Database Administration'
    }
    
    const categoryId = interviewConfig.category || interviewConfig.topic || 'general'
    const categoryTitle = categoryMap[categoryId] || interviewConfig.topic || 'General'
    
    await createInterview({
      userId: userId,
      conversation,
      analysis,
      overall_score: analysis.overallScore,
      communicationScore: analysis.communicationScore,
      confidenceScore: analysis.confidenceScore,
      relevanceScore: analysis.relevanceScore,
      clarityScore: analysis.clarityScore || 0,
      detailedAnalysis: analysis.detailedAnalysis,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      recommendations: analysis.recommendations,
      interviewType: interviewConfig.interviewType || 'General',
      difficulty: interviewConfig.difficulty || 'intermediate',
      topic: categoryTitle,
      category: categoryId,
      timestamp: new Date()
    })
    console.log('Interview saved successfully for user:', userId, 'Category:', categoryTitle)
  } catch (error) {
    console.error('Database save error:', error)
  }
}