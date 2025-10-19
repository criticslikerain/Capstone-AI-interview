import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { amount, description, plan, period, userId } = await request.json()

    // Create PayMongo Checkout Session
    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            line_items: [
              {
                currency: 'PHP',
                amount: amount * 100, // Convert to centavos
                description: description,
                name: `InterviewPro - ${plan}`,
                quantity: 1
              }
            ],
            payment_method_types: ['gcash', 'paymaya', 'card'],
            description: description,
            success_url: `${process.env.NEXTAUTH_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
            metadata: {
              plan: plan,
              period: period,
              userId: userId
            }
          }
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to create checkout session')
    }

    return NextResponse.json({ 
      success: true, 
      checkoutUrl: data.data.attributes.checkout_url,
      sessionId: data.data.id
    })

  } catch (error) {
    console.error('PayMongo checkout creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
