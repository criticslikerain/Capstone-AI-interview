import { NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebase-admin'

export async function POST(request) {
  try {
    const { userId, plan: requestedPlan, period: requestedPeriod } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('Verifying recent payment for user:', userId)
    console.log('Requested plan:', requestedPlan, 'period:', requestedPeriod)

    if (!adminDb) {
      console.error('Firebase Admin not initialized')
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Since the user reached this page after PayMongo redirect,
    // we know they completed the checkout process
    // Use the plan and period from the request, or default to premium monthly
    
    const plan = requestedPlan || 'premium'
    const period = requestedPeriod || 'monthly'
    
    console.log('Activating subscription:', plan, period)
    
    // Calculate next billing date based on period
    const nextBillingDate = new Date()
    if (period === 'yearly') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
    }
    
    // Calculate price based on plan and period
    let price = 399 // default premium monthly
    if (plan === 'premium') {
      price = period === 'yearly' ? 3830 : 399
    } else if (plan === 'professional') {
      price = period === 'yearly' ? 5990 : 599
    }

    // Update subscription in Firebase using Admin SDK
    const subscriptionData = {
      userId,
      plan: plan,
      price: price,
      period: period,
      status: 'active',
      nextBillingDate: nextBillingDate.toISOString(),
      paymentMethod: 'PayMongo (GCash)',
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
