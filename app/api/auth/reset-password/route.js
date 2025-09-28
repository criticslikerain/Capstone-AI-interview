import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
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
    const tokens = await query(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW() AND is_used = FALSE',
      [token]
    );

    if (tokens.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }
    const resetToken = tokens[0];
    const hashedPassword = await bcrypt.hash(password, 12);
        //=================================================
    // i-update ang password sa user
    // Para magamit na niya ang bag-o nga password
    //=================================================
    await db.query(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, resetToken.user_id]
    );
    //=================================================
    // i-mark ang token as used kay gi gamit rata :')
    //=================================================
    await db.query(
      'UPDATE password_reset_tokens SET is_used = TRUE WHERE id = ?',
      [resetToken.id]
    );
    return NextResponse.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}