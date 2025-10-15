import { NextResponse } from 'next/server'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../../../lib/firebase'

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json()
    
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      first_name: firstName,
      last_name: lastName,
      user_type: 'user',
      is_active: true,
      is_email_verified: false,
      created_at: new Date(),
      updated_at: new Date()
    })

    return NextResponse.json({
      message: 'User created successfully',
      userId: user.uid
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    
    let errorMessage = 'Internal server error'
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'User already exists'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}