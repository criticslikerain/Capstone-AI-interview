import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { query } from '../../../../lib/db.js'

function verifyToken(request) {
  const token = request.cookies.get('token')?.value
  if (!token) throw new Error('No token provided')
  return jwt.verify(token, process.env.JWT_SECRET)
}

export async function GET(request) {
  try {
    const decoded = verifyToken(request)
    
    const sessions = await query(
      `SELECT id, session_name, interview_type, job_role, company_name, 
              status, overall_score, completed_at, created_at
       FROM interview_sessions 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [decoded.userId]
    )

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
    const decoded = verifyToken(request)
    const { sessionName, interviewType, jobRole, companyName, difficultyLevel } = await request.json()

    const result = await query(
      `INSERT INTO interview_sessions 
       (user_id, session_name, interview_type, job_role, company_name, difficulty_level, status)
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`,
      [decoded.userId, sessionName, interviewType, jobRole, companyName, difficultyLevel]
    )

    return NextResponse.json({
      message: 'Interview session created',
      sessionId: result.insertId
    }, { status: 201 })

  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}