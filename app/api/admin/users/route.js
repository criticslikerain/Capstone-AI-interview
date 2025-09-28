import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { query } from '../../../../lib/db.js'

function verifyAdmin(request) {
  const token = request.cookies.get('token')?.value
  if (!token) throw new Error('No token provided')
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (decoded.userType !== 'admin') throw new Error('Admin access required')
  return decoded
}

export async function GET(request) {
  try {
    verifyAdmin(request)
    
    const users = await query(`
      SELECT id, email, first_name, last_name, user_type, is_active, 
             is_email_verified, created_at, last_login
      FROM users 
      ORDER BY created_at DESC
    `)

    return NextResponse.json({ users })

  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}