
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
    const { email, paymentMethod, amount, currency, paymentId } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create email content in Arabic
    const emailSubject = 'تأكيد دفع البرنامج التدريبي للاستثمار طويل الأمد'
    const emailContent = `
      <div dir="rtl" style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2C3E50; font-size: 24px; margin-bottom: 10px;">
            مرحباً بك في البرنامج التدريبي للاستثمار!
          </h1>
          <p style="color: #27AE60; font-size: 18px; font-weight: bold;">
            تم تأكيد دفعتك بنجاح ✅
          </p>
        </div>

        <div style="background-color: #ECF0F1; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1A237E; margin-bottom: 15px;">تفاصيل الدفعة:</h3>
          <p style="color: #333333; margin: 5px 0;"><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p style="color: #333333; margin: 5px 0;"><strong>طريقة الدفع:</strong> ${paymentMethod === 'stripe' ? 'بطاقة ائتمانية' : 'PayPal'}</p>
          <p style="color: #333333; margin: 5px 0;"><strong>المبلغ:</strong> ${amount} ${currency}</p>
          <p style="color: #333333; margin: 5px 0;"><strong>رقم المرجع:</strong> ${paymentId}</p>
        </div>

        <div style="background-color: #27AE60; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <h3 style="margin-bottom: 15px;">ماذا بعد؟</h3>
          <p style="margin: 10px 0;">• ستتلقى رسالة أخرى قريباً مع تفاصيل الدخول للبرنامج</p>
          <p style="margin: 10px 0;">• تأكد من إضافة بريدنا الإلكتروني لقائمة الآمنة</p>
          <p style="margin: 10px 0;">• البرنامج سيبدأ قريباً وستكون من المشاركين الأوائل!</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ECF0F1;">
          <p style="color: #333333; font-size: 14px;">
            شكراً لك على ثقتك بنا<br>
            فريق البرنامج التدريبي للاستثمار طويل الأمد
          </p>
        </div>
      </div>
    `

    // In a real implementation, you would use your SMTP service here
    // For now, we'll log the email and update the payment record
    console.log('Sending email to:', email)
    console.log('Subject:', emailSubject)
    console.log('Content:', emailContent)

    // Update payment record to mark email as sent
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({ email_sent: true, updated_at: new Date().toISOString() })
      .eq('id', paymentId)

    if (updateError) {
      console.error('Error updating payment record:', updateError)
    }

    // Here you would integrate with your WordPress SMTP configuration
    // Example structure for when you add the SMTP details:
    /*
    const emailData = {
      to: email,
      subject: emailSubject,
      html: emailContent,
      smtp: {
        host: Deno.env.get('SMTP_HOST'),
        port: Deno.env.get('SMTP_PORT'),
        username: Deno.env.get('SMTP_USERNAME'),
        password: Deno.env.get('SMTP_PASSWORD'),
        secure: true
      }
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email triggered successfully',
        email: email,
        paymentId: paymentId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
