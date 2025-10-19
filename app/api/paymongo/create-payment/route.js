import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { amount, description, plan, period } = await request.json()

    // Create PayMongo Payment Intent
    const response = await fetch('https://api.paymongo.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amount * 100, // Convert to centavos
            payment_method_allowed: ['gcash', 'paymaya', 'card'],
            payment_method_options: {
              card: { request_three_d_secure: 'any' }
            },
            currency: 'PHP',
            description: description,
            statement_descriptor: 'InterviewPro',
            metadata: {
              plan: plan,
              period: period
            }
          }
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to create payment intent')
    }

    return NextResponse.json({ 
      success: true, 
      paymentIntent: data.data 
    })

  } catch (error) {
    console.error('PayMongo payment creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
