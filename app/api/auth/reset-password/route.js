import { NextResponse } from 'next/server';
import { getPasswordResetToken, updateUser, markTokenAsUsed } from '../../../../lib/firebase.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    //=================================================
    // tig find valid reset token 
    // Para ma-verify kung tinuod ang reset request
    //=================================================
    const resetToken = await getPasswordResetToken(token);

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
        //=================================================
    // i-update ang password sa user
    // Para magamit na niya ang bag-o nga password
    //=================================================
    await updateUser(resetToken.user_id, {
      password_hash: hashedPassword
    });
    //=================================================
    // i-mark ang token as used kay gi gamit rata :')
    //=================================================
    await markTokenAsUsed(resetToken.id);
    return NextResponse.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}