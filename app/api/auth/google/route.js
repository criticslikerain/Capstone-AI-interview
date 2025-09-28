import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { query } from '../../../../lib/db';
import jwt from 'jsonwebtoken';


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
    // CHECK KUNG NAA NA BA ANG USER
    // Kung wala pa, mag create ta ug bag-ong user gamit ang info gikan sa Google
    //*******************************************************************
    let users = await query('SELECT * FROM users WHERE email = ?', [email]);
    let user;

    if (users.length === 0) {
      // himo new user
      const userId = crypto.randomUUID();
      await query(
        'INSERT INTO users (id, email, first_name, last_name, profile_picture_url, is_email_verified, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, email, given_name || 'User', family_name || '', picture, true, 'user']
      );
      users = await query('SELECT * FROM users WHERE id = ?', [userId]);
    }

    user = users[0];

    //*******************************************************************
    // UPDATE LAST LOGIN
    // Para ma record kanus-a last ni login ang user
    //*******************************************************************
    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        userType: user.user_type 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        userType: user.user_type,
        profilePicture: user.profile_picture_url
      },
      redirectTo: user.user_type === 'admin' ? '/dashboard' : '/user-dashboard'
    });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return response;

  } catch (error) {

    console.error('Google OAuth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}