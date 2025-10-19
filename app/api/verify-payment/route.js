import { NextResponse } from 'next/server'
import { updateUserSubscription } from '../../../lib/firebase'

export async function POST(request) {
  try {
    const { plan, period, userId } = await request.json()

    if (!plan || !period || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate next billing date
    const nextBillingDate = new Date()
    if (period === 'yearly') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
    } else if (period === 'monthly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
    }

    // Update subscription in Firebase
    const subscriptionData = {
      plan: plan,
      price: plan === 'premium' ? 399 : 3830,
      period: period,
      status: 'active',
      nextBillingDate: nextBillingDate.toISOString(),
      paymentMethod: 'PayMongo',
      lastPaymentDate: new Date().toISOString()
    }

    await updateUserSubscription(userId, subscriptionData)

    return NextResponse.json({
      success: true,
      status: 'paid',
      subscription: subscriptionData
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
