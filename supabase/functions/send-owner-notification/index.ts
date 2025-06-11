
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

    const {
      firstName,
      lastName,
      email,
      promotionalConsent,
      paymentMethod,
      subscriberId
    } = await req.json()

    console.log('Sending owner notification for subscriber:', subscriberId)

    // Send email notification to owner
    const { error: emailError } = await supabaseClient.functions.invoke('send-payment-confirmation', {
      body: {
        email: 'owner@example.com', // Replace with actual owner email
        subject: 'إشعار اشتراك جديد - New Subscription Alert',
        isOwnerNotification: true,
        subscriberDetails: {
          firstName,
          lastName,
          email,
          promotionalConsent,
          paymentMethod,
          subscriberId,
          timestamp: new Date().toISOString()
        }
      }
    })

    if (emailError) {
      console.error('Error sending owner notification:', emailError)
      return new Response('Error sending notification', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Owner notification error:', error)
    return new Response('Notification error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
