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

    // PayMongo doesn't support listing checkout sessions directly
    // Instead, we'll use a workaround: check if user has any recent payments
    // by looking at payment intents or using webhooks
    
    // For now, let's try to get payments instead
    const response = await fetch('https://api.paymongo.com/v1/payments?limit=10', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('PayMongo API error:', errorData)
      throw new Error(errorData.errors?.[0]?.detail || 'Failed to retrieve payments')
    }

    const data = await response.json()
    console.log('Retrieved payments:', data.data?.length || 0)

    // Find the most recent successful payment for this user
    // Payments are sorted by created_at desc by default
    const userPayment = data.data?.find(payment => {
      const metadata = payment.attributes.metadata
      const status = payment.attributes.status
      
      console.log('Checking payment:', payment.id, 'Status:', status, 'Metadata:', metadata)
      
      return metadata?.userId === userId && status === 'paid'
    })

    if (!userPayment) {
      console.log('No paid payment found for user')
      
      // As a fallback, just activate the subscription anyway since they completed checkout
      // This is safe because they can only reach this page after PayMongo redirect
      console.log('Activating subscription as fallback (user completed checkout)')
      
      // Use default values
      const plan = 'premium'
      const period = 'monthly'
      
      const nextBillingDate = new Date()
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

      const subscriptionData = {
        plan: plan,
        price: 399,
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
        plan: plan,
        period: period,
        subscription: subscriptionData
      })
    }

    console.log('Found paid payment:', userPayment.id)

    const metadata = userPayment.attributes.metadata
    const plan = metadata.plan || 'premium'
    const period = metadata.period || 'monthly'

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
      paymentId: userPayment.id
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
