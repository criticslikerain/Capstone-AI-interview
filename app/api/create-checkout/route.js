import { NextResponse } from 'next/server'
import { createCheckoutSession } from '../../../lib/paymongo'

export async function POST(request) {
  try {
    const { amount, description, plan, period, userId } = await request.json()

    if (!amount || !plan || !period || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await createCheckoutSession({
      amount,
      description: description || `InterviewPro ${period === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
      plan,
      period,
      userId,
      successUrl: `${process.env.NEXTAUTH_URL}/payment-success?plan=${plan}&period=${period}&userId=${userId}`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/pricing`
    })

    if (!result.success) {
      throw new Error(result.error)
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
