import { NextResponse } from 'next/server'
import { updateUserSubscription } from '../../../../lib/firebase'

export async function POST(request) {
  try {
    const body = await request.json()
    const event = body.data

    // Handle different webhook events
    switch (event.attributes.type) {
      case 'checkout_session.payment.paid':
        await handlePaymentSuccess(event)
        break
      
      case 'payment.paid':
        await handlePaymentSuccess(event)
        break
      
      case 'payment.failed':
        console.error('Payment failed:', event)
        break
      
      default:
        console.log('Unhandled event type:', event.attributes.type)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(event) {
  try {
    const metadata = event.attributes.data?.attributes?.metadata || {}
    const { userId, plan, period } = metadata

    if (!userId) {
      console.error('No userId in metadata')
      return
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
      lastPaymentDate: new Date().toISOString(),
      paymentId: event.id
    }

    await updateUserSubscription(userId, subscriptionData)
    console.log('Subscription updated successfully for user:', userId)

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}
