import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { amount, description, plan, period, userId } = await request.json()

    if (!amount || !plan || !period || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the base URL from the request headers or environment
    const host = request.headers.get('host')
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`
    
    console.log('Payment redirect base URL:', baseUrl)

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
                description: description || `InterviewPro ${period === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
                name: `InterviewPro - ${plan}`,
                quantity: 1
              }
            ],
            payment_method_types: ['gcash'],
            description: description || `InterviewPro ${period === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
            success_url: `${baseUrl}/payment-success?ref=${userId}-${Date.now()}`,
            cancel_url: `${baseUrl}/pricing`,
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

    // Store the session ID for later verification
    const sessionId = data.data.id
    
    return NextResponse.json({ 
      success: true, 
      checkoutUrl: data.data.attributes.checkout_url,
      sessionId: sessionId,
      metadata: {
        plan,
        period,
        userId
      }
    })

  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
