import { NextResponse } from 'next/server'

export async function GET(request) {
  try {

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }


    const sessions = [
      {
        id: '1',
        session_name: 'Technical Interview Practice',
        interview_type: 'Technical',
        status: 'completed',
        overall_score: 4,
        created_at: new Date().toISOString()
      },
      {
        id: '2', 
        session_name: 'Behavioral Interview Practice',
        interview_type: 'Behavioral',
        status: 'completed',
        overall_score: 3,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { sessionName, interviewType, jobRole, companyName, difficultyLevel } = await request.json()


    const newSession = {
      id: Date.now().toString(),
      session_name: sessionName,
      interview_type: interviewType,
      job_role: jobRole,
      company_name: companyName,
      difficulty_level: difficultyLevel,
      status: 'scheduled',
      created_at: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Interview session created',
      sessionId: newSession.id
    }, { status: 201 })

  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}