import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { adminDb, adminAuth } from '../../../../lib/firebase-admin';
import { sign } from 'jsonwebtoken';
import crypto from 'crypto';


//****************************************************************************
// GOOGLE OAUTH ENDPOINT - DIRI MO AGI TANAN GOOGLE LOGIN
// Mo verify ni sa Google token, mo create ug user kung bag-o, mo issue ug JWT
// Dili ni mo allow kung walay verified email gikan sa Google
//****************************************************************************
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export async function POST(request) {
  try {
    console.log('Google auth API called');
    const { credential } = await request.json();

    if (!credential) {
      console.error('No credential provided');
      return NextResponse.json({ error: 'Google credential is required' }, { status: 400 });
    }

    console.log('Verifying Google token...');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');

    //*******************************************************************
    // VERIFY SA GOOGLE TOKEN
    // Mo check ni sa authenticity sa token gamit ang Google API
    //*******************************************************************
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log('Token verified successfully');

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, email_verified } = payload;
    
    console.log('User email:', email, 'Verified:', email_verified);

    if (!email_verified) {
      return NextResponse.json({ error: 'Email not verified by Google' }, { status: 400 });
    }

    //*******************************************************************
    // CHECK KUNG NAA NA BA ANG USER SA FIRESTORE USING ADMIN SDK
    // Kung wala pa, mag create ta ug bag-ong user gamit ang info gikan sa Google
    //*******************************************************************
    console.log('Checking if user exists in Firestore...');
    
    if (!adminDb) {
      throw new Error('Firebase Admin not initialized');
    }
    
    const usersRef = adminDb.collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();
    
    let userId;
    const now = new Date();
    
    if (querySnapshot.empty) {
      console.log('Creating new user...');
      // Create new user in Firestore using Admin SDK (bypasses security rules)
      userId = crypto.randomUUID();
      const userData = {
        email: email,
        first_name: given_name || 'User',
        last_name: family_name || '',
        profile_picture_url: picture || '',
        is_email_verified: true,
        is_active: true,
        user_type: 'user',
        created_at: now,
        updated_at: now,
        last_login: now
      };
      
      console.log('User data to create:', userData);
      await usersRef.doc(userId).set(userData);
      console.log('User created successfully with ID:', userId);
    } else {
      console.log('User exists, updating last login...');
      // User already exists, get the existing user
      const existingUser = querySnapshot.docs[0];
      userId = existingUser.id;
      
      // Update last login using Admin SDK
      await usersRef.doc(userId).update({
        last_login: now,
        updated_at: now
      });
      console.log('User updated successfully');
    }
    // Get user data
    const userData = {
      id: userId,
      email: email,
      first_name: given_name || 'User',
      last_name: family_name || '',
      user_type: querySnapshot.empty ? 'user' : querySnapshot.docs[0].data().user_type || 'user',
      profile_picture_url: picture
    };

    //*******************************************************************
    // CREATE OR GET FIREBASE AUTH USER
    // This ensures the user exists in Firebase Auth, not just Firestore
    //*******************************************************************
    console.log('Creating/getting Firebase Auth user...');
    let firebaseAuthUser;
    try {
      // Try to get existing auth user
      firebaseAuthUser = await adminAuth.getUserByEmail(email);
      console.log('Firebase Auth user exists:', firebaseAuthUser.uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new Firebase Auth user
        console.log('Creating new Firebase Auth user...');
        firebaseAuthUser = await adminAuth.createUser({
          uid: userId,
          email: email,
          emailVerified: true,
          displayName: `${given_name || ''} ${family_name || ''}`.trim(),
          photoURL: picture || null
        });
        console.log('Firebase Auth user created:', firebaseAuthUser.uid);
      } else {
        throw error;
      }
    }

    // Generate custom Firebase token for client-side auth
    console.log('Generating custom Firebase token...');
    const customToken = await adminAuth.createCustomToken(firebaseAuthUser.uid);
    console.log('Custom Firebase token generated');

    // Generate JWT token
    console.log('Generating JWT token...');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const token = sign(
      { 
        userId: userId, 
        email: email, 
        userType: userData.user_type,
        firstName: userData.first_name,
        lastName: userData.last_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('JWT token generated successfully');

    const response = NextResponse.json({
      message: 'Login successful',
      customToken: customToken,
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        userType: userData.user_type,
        profilePicture: userData.profile_picture_url
      },
      redirectTo: userData.user_type === 'admin' ? '/admin' : '/user-dashboard'
    });

    // Set cookie with the token
    response.cookies.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Google OAuth error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json({ 
      error: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}