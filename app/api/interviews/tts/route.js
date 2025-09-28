import { NextResponse } from 'next/server'

const ELEVEN_LABS_KEYS = [
 // process.env.ELEVEN_LABS_API_KEY,
 // process.env.ELEVEN_LABS_API_KEY_2,
  process.env.ELEVEN_LABS_API_KEY_3,
  process.env.ELEVEN_LABS_API_KEY_4,
  process.env.ELEVEN_LABS_API_KEY_5,
  process.env.ELEVEN_LABS_API_KEY_6,
  process.env.ELEVEN_LABS_API_KEY_7,
  process.env.ELEVEN_LABS_API_KEY_8,
  process.env.ELEVEN_LABS_API_KEY_9,
  process.env.ELEVEN_LABS_API_KEY_10
].filter(key => key && key.trim() !== '') //=================================================
    // I-filter ang empty keys kay dili magamit
    //=================================================

export async function POST(request) {
  try {
    const { text } = await request.json()
    console.log(`Attempting TTS with ${ELEVEN_LABS_KEYS.length} available API keys`)
    for (let i = 0; i < ELEVEN_LABS_KEYS.length; i++) {
      const apiKey = ELEVEN_LABS_KEYS[i]
      
      try {
        console.log(`Trying ElevenLabs API key ${i + 1}/${ELEVEN_LABS_KEYS.length}`)
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVEN_LABS_VOICE_ID}`, {
          method: "POST",
          headers: {
            "Accept": "audio/mpeg",
            "xi-api-key": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.2,
              use_speaker_boost: true
            }
          })
        })
        if (response.ok) {
          console.log(`Success with API key ${i + 1}`)
          const arrayBuffer = await response.arrayBuffer()
          return new NextResponse(arrayBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'no-cache'
            }
          })
        }
        const errorText = await response.text()
        console.log(`ElevenLabs API key ${i + 1} failed:`, response.status, errorText)
        
        //=================================================
        // Kung rate limited ta, maghuwat usa
        // Antes mo try ug lain API key
        //=================================================
        if (response.status === 429 || errorText.includes('rate')) {
          console.log('Rate limited, waiting 1 second before next attempt...')
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
      } catch (error) {
        console.log(`ElevenLabs API key ${i + 1} error:`, error.message)
        
        //=================================================
        // Kung rate limited ta, maghuwat usa
        // Antes mo try ug lain API key
        //=================================================
        if (error.message.includes('rate')) {
          console.log('Rate limited, waiting 1 second before next attempt...')
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        if (i < ELEVEN_LABS_KEYS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    }

    console.error('All ElevenLabs API keys exhausted')
    throw new Error(`All ${ELEVEN_LABS_KEYS.length} ElevenLabs API keys failed`)

  } catch (error) {
    console.error('TTS API complete failure:', error)
    return NextResponse.json(
      { error: 'TTS generation failed after trying all available API keys' },
      { status: 500 }
    )
  }
}