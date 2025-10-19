import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getUserByEmail, updateUser } from '../../../../lib/firebase.js'

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
    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

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
    await updateUser(user.id, { last_login: new Date() })

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.user_type,
        firstName: user.first_name,
        lastName: user.last_name
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

    response.cookies.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
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