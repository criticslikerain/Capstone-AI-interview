import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '../../../../lib/db.js'
export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json()
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    //=================================================
    // I-check kung naa na ning user
    // Para walay duplicate accounts
    //=================================================
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }





    
    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    //=================================================
    // I-create ang bag-o nga user account
    //=================================================
    await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, user_type) 
       VALUES (?, ?, ?, ?, 'user')`,
      [email, hashedPassword, firstName, lastName]
    )

    return NextResponse.json({
      message: 'User created successfully',
      userId: result.insertId
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}