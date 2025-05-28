
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const body = await req.json()
    
    // Handle PayPal payment completion
    if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED' || body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const paymentData = body.resource
      const customerEmail = paymentData.payer?.email_address
      const amount = paymentData.amount?.value || paymentData.purchase_units?.[0]?.amount?.value
      const currency = paymentData.amount?.currency_code || paymentData.purchase_units?.[0]?.amount?.currency_code

      if (customerEmail) {
        // Store payment record
        const { data: payment, error: paymentError } = await supabaseClient
          .from('payments')
          .insert({
            email: customerEmail,
            payment_method: 'paypal',
            amount: parseFloat(amount),
            currency: currency || 'USD',
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
            paymentMethod: 'paypal',
            amount: parseFloat(amount),
            currency: currency || 'USD',
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
    console.error('PayPal webhook error:', error)
    return new Response('Webhook error', { status: 500 })
  }
})
