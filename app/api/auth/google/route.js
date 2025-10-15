import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../../../../lib/firebase';
import { collection, query as firestoreQuery, where, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
    const { credential } = await request.json();








    if (!credential) {
      return NextResponse.json({ error: 'Google credential is required' }, { status: 400 });
    }

    //*******************************************************************
    // VERIFY SA GOOGLE TOKEN
    // Mo check ni sa authenticity sa token gamit ang Google API
    //*******************************************************************
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });





    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, email_verified } = payload;

    if (!email_verified) {
      return NextResponse.json({ error: 'Email not verified by Google' }, { status: 400 });
    }

    //*******************************************************************
    // CHECK KUNG NAA NA BA ANG USER SA FIRESTORE
    // Kung wala pa, mag create ta ug bag-ong user gamit ang info gikan sa Google
    //*******************************************************************
    const usersQuery = firestoreQuery(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(usersQuery);
    
    let userId;
    
    if (querySnapshot.empty) {
      // Create new user in Firestore
      userId = crypto.randomUUID();
      const userData = {
        email: email,
        first_name: given_name || 'User',
        last_name: family_name || '',
        profile_picture_url: picture,
        is_email_verified: true,
        user_type: 'user',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        last_login: serverTimestamp()
      };
      
      const userDoc = doc(db, 'users', userId);
      await setDoc(userDoc, userData);
    } else {
      // User already exists, get the existing user
      const existingUser = querySnapshot.docs[0];
      userId = existingUser.id;
      const userDoc = existingUser.ref;
      
      // Update last login
      await updateDoc(userDoc, {
        last_login: serverTimestamp(),
        updated_at: serverTimestamp()
      });
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

    // Generate JWT token
    const token = sign(
      { 
        userId: userId, 
        email: email, 
        userType: userData.user_type 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
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

    // Set HTTP-only cookie with the token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    });

    return response;

  } catch (error) {

    console.error('Google OAuth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}