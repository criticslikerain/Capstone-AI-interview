import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../../../../lib/db.js'

//****************************************************************************
// LOGIN ENDPOINT - DIRI MO AJI TANAN LOGIN REQUESTS
// Mag expect ni ug email ug password gikan sa user
// Balik ni ug JWT token kung success ang login
//****************************************************************************
export async function POST(request) {
  try {
    const { email, password } = await request.json()

    //*******************************************************************
    // INPUT VALIDATION
    // Kung walay email or password, error dayon
    // Di ta pwede magpa login ug kulang ang details
    //*******************************************************************
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    const users = await query(
      'SELECT id, email, password_hash, first_name, last_name, user_type, is_active FROM users WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = users[0]

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      )
    }

    //*******************************************************************
    // PASSWORD CHECK WAT DA HECK!
    // Icumpara ang gi input nga password sa encrypted password
    // Gamiton ang bcrypt para secure ang comparison
    //*******************************************************************
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    //*******************************************************************
    // UPDATE LAST LOGIN TIME
    // Para mahibaw-an nato kanus-a last time ni login
    //*******************************************************************
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    )

    // jwt gen. 
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.user_type 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        userType: user.user_type
      },
      redirectTo: user.user_type === 'admin' ? '/admin' : '/user-dashboard'
    })

    // http-only cookie 
    // damnss--
    // 7days naka set 
    // =-=-=-=-=-=-=-=-=-=-=
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}