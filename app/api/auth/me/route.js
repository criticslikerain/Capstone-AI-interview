import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    
    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        userType: decoded.userType,
        first_name: decoded.firstName,
        last_name: decoded.lastName
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
