import { NextResponse } from 'next/server'
import { updateUserSubscription } from '../../../lib/firebase'

export async function POST(request) {
  try {
    const { sessionId, userId } = await request.json()

    if (!sessionId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Verifying payment for session:', sessionId, 'user:', userId)

    // Retrieve the checkout session from PayMongo
    const response = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to retrieve checkout session')
    }

    const data = await response.json()
    console.log('PayMongo session data:', data)

    const session = data.data
    const metadata = session.attributes.metadata
    const paymentStatus = session.attributes.payment_status

    // Verify user ID matches
    if (metadata.userId !== userId) {
      console.error('User ID mismatch:', metadata.userId, 'vs', userId)
      return NextResponse.json(
        { success: false, error: 'User mismatch. Please contact support if you were charged.' },
        { status: 403 }
      )
    }

    // Check if payment was successful
    if (paymentStatus !== 'paid') {
      return NextResponse.json(
        { success: false, error: `Payment status: ${paymentStatus}` },
        { status: 400 }
      )
    }

    const plan = metadata.plan
    const period = metadata.period

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
      price: plan === 'premium' ? (period === 'yearly' ? 3830 : 399) : (period === 'yearly' ? 5990 : 599),
      period: period,
      status: 'active',
      nextBillingDate: nextBillingDate.toISOString(),
      paymentMethod: 'PayMongo',
      lastPaymentDate: new Date().toISOString(),
      paymentSessionId: sessionId
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
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
