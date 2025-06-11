
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

    const { subject, content } = await req.json()

    console.log('Sending promotional email:', subject)

    // Get all subscribers who consented to promotional emails
    const { data: subscribers, error: subscribersError } = await supabaseClient
      .from('subscribers')
      .select('email, first_name, last_name')
      .eq('promotional_consent', true)

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError)
      return new Response('Error fetching subscribers', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No subscribers with consent found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Send emails to all consented subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      const personalizedContent = content.replace('{{firstName}}', subscriber.first_name)
      
      return await supabaseClient.functions.invoke('send-payment-confirmation', {
        body: {
          email: subscriber.email,
          subject: subject,
          isPromotionalEmail: true,
          promotionalContent: personalizedContent,
          subscriberName: `${subscriber.first_name} ${subscriber.last_name}`
        }
      })
    })

    const results = await Promise.allSettled(emailPromises)
    
    const successCount = results.filter(result => result.status === 'fulfilled').length
    const failureCount = results.filter(result => result.status === 'rejected').length

    console.log(`Promotional email sent: ${successCount} success, ${failureCount} failures`)

    return new Response(JSON.stringify({ 
      success: true,
      sentTo: successCount,
      failures: failureCount,
      totalSubscribers: subscribers.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Promotional email error:', error)
    return new Response('Email sending error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
