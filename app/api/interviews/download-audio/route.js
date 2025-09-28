import { NextResponse } from 'next/server'

// #################################################
// daghan kaayo ni’g keys kay basin mag-inarte ang usa
// so naa pay backup ba
// #################################################




const ELEVEN_LABS_KEYS = [
  process.env.ELEVEN_LABS_API_KEY,
  process.env.ELEVEN_LABS_API_KEY_2,
  process.env.ELEVEN_LABS_API_KEY_3
]
export async function POST(request) {
  try {
    const { conversation } = await request.json()
    const fullText = conversation
      .map(msg => {
        const speaker = msg.type === 'ai' ? 'AI Interviewer' : 'Candidate'
        // klaro kaayo kinsa’y nag-istorya - luy-a
        return `${speaker}: ${msg.text}`
      })
      .join('. ')
    let audioBuffer
    for (let i = 0; i < ELEVEN_LABS_KEYS.length; i++) {
      const apiKey = ELEVEN_LABS_KEYS[i]
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVEN_LABS_VOICE_ID}`, {
          method: "POST",
          headers: {
            "Accept": "audio/mpeg",
            "xi-api-key": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: fullText,
            model_id: "eleven_multilingual_v2"
          })
        })
        if (response.ok) {
          audioBuffer = await response.arrayBuffer()
          break
        }
        console.log(`ElevenLabs API key ${i + 1} failed:`, response.status)
      } catch (error) {
        console.log(`ElevenLabs API key ${i + 1} error:`, error.message)
      }
    }








    // ##########################################################
    // kung walay ni gana, aw sakto ra gyud nga gi-basted ta tanan - utan
    // ##########################################################


    if (!audioBuffer) {
      throw new Error('All ElevenLabs API keys failed')
    }
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="interview-${Date.now()}.mp3"`
      }
    })
  } catch (error) {







    // #######################################
    // kapoy pero okay ra, at least ni attempt
    // #######################################
    console.error('Audio generation error:', error)
    return NextResponse.json(
      { error: 'Audio generation failed' },
      { status: 500 }
    )
  }
}
