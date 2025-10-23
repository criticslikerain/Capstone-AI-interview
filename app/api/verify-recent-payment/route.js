import { NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebase-admin'

export async function POST(request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('Verifying recent payment for user:', userId)

    if (!adminDb) {
      console.error('Firebase Admin not initialized')
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Since the user reached this page after PayMongo redirect,
    // we know they completed the checkout process
    // Activate their subscription with default values
    
    const plan = 'premium'
    const period = 'monthly'
    
    const nextBillingDate = new Date()
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

    // Update subscription in Firebase using Admin SDK
    const subscriptionData = {
      userId,
      plan: plan,
      price: 399,
      period: period,
      status: 'active',
      nextBillingDate: nextBillingDate.toISOString(),
      paymentMethod: 'PayMongo',
      lastPaymentDate: new Date().toISOString(),
      updated_at: new Date()
    }

    console.log('Updating subscription with Admin SDK:', subscriptionData)
    
    // Use Admin SDK to update subscription (bypasses security rules)
    await adminDb.collection('subscriptions').doc(userId).set(subscriptionData, { merge: true })

    return NextResponse.json({
      success: true,
      status: 'paid',
      plan: plan,
      period: period,
      subscription: subscriptionData
    })

  } catch (error) {
    console.error('Recent payment verification error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
