import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getAllUsers } from '../../../../lib/firebase.js'

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
    
    const users = await getAllUsers()

    return NextResponse.json({ users })

  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}