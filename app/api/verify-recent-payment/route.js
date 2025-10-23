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

    // List recent checkout sessions from PayMongo
    // Note: PayMongo doesn't have a direct API to list sessions by metadata
    // So we'll need to check the most recent sessions
    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions?limit=10', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to retrieve checkout sessions')
    }

    const data = await response.json()
    console.log('Retrieved checkout sessions:', data.data?.length || 0)

    // Find the most recent paid session for this user
    const userSession = data.data?.find(session => {
      const metadata = session.attributes.metadata
      const paymentStatus = session.attributes.payment_status
      
      console.log('Checking session:', session.id, 'Status:', paymentStatus, 'User:', metadata?.userId)
      
      return metadata?.userId === userId && paymentStatus === 'paid'
    })

    if (!userSession) {
      console.log('No paid session found for user')
      return NextResponse.json(
        { success: false, error: 'No recent payment found. Please try again or contact support.' },
        { status: 404 }
      )
    }

    console.log('Found paid session:', userSession.id)

    const metadata = userSession.attributes.metadata
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
      paymentSessionId: userSession.id
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
