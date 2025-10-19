import { NextResponse } from 'next/server'
import { updateUserSubscription } from '../../../../lib/firebase'

export async function POST(request) {
  try {
    const body = await request.json()
    const event = body.data

    console.log('PayMongo Webhook Event:', event.attributes.type)

    // Handle different webhook events
    switch (event.attributes.type) {
      case 'checkout_session.payment.paid':
        await handleCheckoutSessionPaid(event)
        break
      
      case 'payment.paid':
        await handlePaymentPaid(event)
        break
      
      case 'payment.failed':
        console.error('Payment failed:', event)
        await handlePaymentFailed(event)
        break
      
      default:
        console.log('Unhandled event type:', event.attributes.type)
    }

    return NextResponse.json({ success: true, received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionPaid(event) {
  try {
    const attributes = event.attributes.data?.attributes
    const metadata = attributes?.metadata || {}
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
      paymentId: event.id,
      paymentStatus: 'paid'
    }

    await updateUserSubscription(userId, subscriptionData)
    console.log('Subscription updated successfully for user:', userId)

  } catch (error) {
    console.error('Error handling checkout session paid:', error)
  }
}

async function handlePaymentPaid(event) {
  try {
    const attributes = event.attributes.data?.attributes
    const metadata = attributes?.metadata || {}
    
    console.log('Payment paid event received:', metadata)
    // Additional handling if needed

  } catch (error) {
    console.error('Error handling payment paid:', error)
  }
}

async function handlePaymentFailed(event) {
  try {
    const attributes = event.attributes.data?.attributes
    const metadata = attributes?.metadata || {}
    const { userId } = metadata

    if (userId) {
      // Optionally update subscription status to failed
      await updateUserSubscription(userId, {
        paymentStatus: 'failed',
        lastPaymentAttempt: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}
