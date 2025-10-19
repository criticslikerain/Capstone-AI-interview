

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY
const PAYMONGO_BASE_URL = 'https://api.paymongo.com/v1'

const getAuthHeader = () => {
  return `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`
}

export async function createCheckoutSession({ amount, description, plan, period, userId, successUrl, cancelUrl }) {
  try {
    const response = await fetch(`${PAYMONGO_BASE_URL}/checkout_sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
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
                amount: amount * 100,
                description: description,
                name: `InterviewPro - ${plan}`,
                quantity: 1
              }
            ],
            payment_method_types: ['gcash'],
            description: description,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
              plan: plan,
              period: period,
              userId: userId,
              amount: amount.toString()
            }
          }
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to create checkout session')
    }

    return {
      success: true,
      checkoutUrl: data.data.attributes.checkout_url,
      sessionId: data.data.id,
      paymentStatus: data.data.attributes.payment_status
    }
  } catch (error) {
    console.error('PayMongo checkout creation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function retrieveCheckoutSession(sessionId) {
  try {
    const response = await fetch(`${PAYMONGO_BASE_URL}/checkout_sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader()
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to retrieve checkout session')
    }

    return {
      success: true,
      session: data.data
    }
  } catch (error) {
    console.error('PayMongo session retrieval error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function createPaymentIntent({ amount, description, plan, period }) {
  try {
    const response = await fetch(`${PAYMONGO_BASE_URL}/payment_intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amount * 100,
            payment_method_allowed: ['gcash'],
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

    return {
      success: true,
      paymentIntent: data.data
    }
  } catch (error) {
    console.error('PayMongo payment intent creation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function retrievePaymentIntent(paymentIntentId) {
  try {
    const response = await fetch(`${PAYMONGO_BASE_URL}/payment_intents/${paymentIntentId}`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader()
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to retrieve payment intent')
    }

    return {
      success: true,
      paymentIntent: data.data
    }
  } catch (error) {
    console.error('PayMongo payment intent retrieval error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
