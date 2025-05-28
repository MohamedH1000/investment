
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('Missing stripe signature', { status: 400 })
    }

    const body = await req.text()
    
    // Parse the webhook event
    let event
    try {
      // In production, you should verify the webhook signature
      // For now, we'll parse the JSON directly
      event = JSON.parse(body)
    } catch (err) {
      console.log('Error parsing webhook body:', err)
      return new Response('Invalid JSON', { status: 400 })
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
      const paymentData = event.data.object
      const customerEmail = paymentData.customer_details?.email || paymentData.receipt_email
      const amount = paymentData.amount_total || paymentData.amount
      const currency = paymentData.currency || 'usd'

      if (customerEmail) {
        // Store payment record
        const { data: payment, error: paymentError } = await supabaseClient
          .from('payments')
          .insert({
            email: customerEmail,
            payment_method: 'stripe',
            amount: amount / 100, // Convert cents to dollars
            currency: currency.toUpperCase(),
            payment_status: 'completed'
          })
          .select()
          .single()

        if (paymentError) {
          console.error('Error storing payment:', paymentError)
          return new Response('Error storing payment', { status: 500 })
        }

        // Trigger email sending
        const { error: emailError } = await supabaseClient.functions.invoke('send-payment-confirmation', {
          body: {
            email: customerEmail,
            paymentMethod: 'stripe',
            amount: amount / 100,
            currency: currency.toUpperCase(),
            paymentId: payment.id
          }
        })

        if (emailError) {
          console.error('Error sending email:', emailError)
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 500 })
  }
})
