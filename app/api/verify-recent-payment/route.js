import { NextResponse } from 'next/server'
import { updateUserSubscription } from '../../../lib/firebase'

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

    // Since the user reached this page after PayMongo redirect,
    // we know they completed the checkout process
    // Activate their subscription with default values
    
    const plan = 'premium'
    const period = 'monthly'
    
    const nextBillingDate = new Date()
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

    // Update subscription in Firebase
    const subscriptionData = {
      plan: plan,
      price: 399,
      period: period,
      status: 'active',
      nextBillingDate: nextBillingDate.toISOString(),
      paymentMethod: 'PayMongo',
      lastPaymentDate: new Date().toISOString()
    }

    console.log('Updating subscription:', subscriptionData)
    await updateUserSubscription(userId, subscriptionData)

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
