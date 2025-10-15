import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }


    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString()

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })


    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Email Verification - InterviewPro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06b6d4;">Email Verification</h2>
          <p>Thank you for signing up with InterviewPro!</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f9ff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #06b6d4; font-size: 32px; margin: 0; letter-spacing: 5px;">${verificationCode}</h1>
          </div>
          <p>Please enter this code to verify your email address and complete your registration.</p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">InterviewPro - AI Interview Practice Platform</p>
        </div>
      `
    }


    await transporter.sendMail(mailOptions)

    return NextResponse.json({ 
      success: true, 
      verificationCode,
      message: 'Verification code sent successfully' 
    })

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json({ 
      error: 'Failed to send verification email' 
    }, { status: 500 })
  }
}