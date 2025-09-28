import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { messages, isClosingStatement = false } = await request.json()
    console.log('=== Chat API Called ===')
    console.log('Messages:', messages)
    console.log('Is closing statement:', isClosingStatement)
    if (isClosingStatement) {
      const userMessages = messages.filter(m => m.role === 'user')
      
      //===============================================
      // I-extract  ang name sa user sa ilang conversation so that personal ang message
      //===============================================
      let userName = ""
      const firstUserMessage = userMessages[0]?.content?.toLowerCase() || ""
      const namePatterns = [
        /i'm\s+(\w+)/i,
        /i am\s+(\w+)/i,
        /my name is\s+(\w+)/i,
        /call me\s+(\w+)/i,
        /im\s+(\w+)/i
      ]
      for (const pattern of namePatterns) {
        const match = firstUserMessage.match(pattern)
        if (match && match[1] && match[1].toLowerCase() !== 'a') {
          userName = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase()
          break
        }
      }      
 //===============================================
      //  ambot sagbot, (para AI  prompt sheshh!)
  //===============================================
      const closingMessages = userName 
        ? [
            `Thank you so much, ${userName}! That was a wonderful interview. Let me analyze our conversation now and I'll have your personalized feedback ready in just a moment. You did great!`,
            `Excellent interview, ${userName}! I really enjoyed our conversation. Give me a moment to analyze your responses and prepare detailed feedback for you. Well done!`,
            `Thank you, ${userName}, that was fantastic! I'm now going to review our entire conversation and create a comprehensive analysis for you. You'll see the results shortly!`
          ]
        : [
            `Thank you so much! That was a wonderful interview. Let me analyze our conversation now and I'll have your personalized feedback ready in just a moment. You did great!`,
            `Excellent interview! I really enjoyed our conversation. Give me a moment to analyze your responses and prepare detailed feedback for you. Well done!`,
            `Thank you, that was fantastic! I'm now going to review our entire conversation and create a comprehensive analysis for you. You'll see the results shortly!`
          ]
      
      const randomClosing = closingMessages[Math.floor(Math.random() * closingMessages.length)]
      console.log('Generated closing statement:', randomClosing)
      
      return NextResponse.json({ response: randomClosing })
    }
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3.1",
        messages: [
          { 
            role: "system", 
            content: "You are a professional job interviewer. Ask follow-up questions based on what the candidate tells you. Be conversational. Keep responses under 30 words."
          },
          ...messages.slice(1)
        ],
        max_tokens: 60,
        temperature: 0.7,
      }),
    })

    console.log('HuggingFace API Status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('HuggingFace API Error:', response.status, errorText)
      
      //=================================================
      // Kung ma fail ang API, =======> backup response <=======
      // base sa last message sa user para dili ma stuck
      //=================================================
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""
      
      if (lastMessage.includes("freelance") && lastMessage.includes("developer")) {
        return NextResponse.json({ response: "What kind of projects do you work on as a freelance developer?" })
      } else if (lastMessage.includes("no")) {
        return NextResponse.json({ response: "That's okay. What motivates you in your work?" })
      } else if (lastMessage.includes("dreadful")) {
        return NextResponse.json({ response: "What made it challenging? How did you overcome those difficulties?" })
      } else {
        return NextResponse.json({ response: "I understand. Can you tell me more about your experience?" })
      }
    }

    const data = await response.json()
    console.log('HuggingFace API Response:', data)
    
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      let aiResponse = data.choices[0].message.content.trim()
      console.log('AI Response:', aiResponse)
      if (aiResponse.toLowerCase().includes("i am") || aiResponse.toLowerCase().includes("i'm a") || aiResponse.toLowerCase().includes("my name is")) {
        const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""
        if (lastMessage.includes("freelance")) {
          aiResponse = "What programming languages do you specialize in?"
        } else if (lastMessage.includes("no")) {
          aiResponse = "What would you say is your biggest strength?"
        } else {
          aiResponse = "That's interesting. Can you elaborate on that?"
        }
      } 
      return NextResponse.json({ response: aiResponse })
    }
    console.log('No valid response from API, using fallback')
    return NextResponse.json({ response: "I see. What else can you share about that?" })
  } catch (error) {
    console.error('Complete Chat API Failure:', error)
    return NextResponse.json({ response: "That's interesting. What else would you like to tell me?" })
  }
}