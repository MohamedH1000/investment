
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody = await req.json()
    console.log('Email request received:', requestBody)

    // Handle different types of emails
    if (requestBody.isOwnerNotification) {
      // Owner notification email
      const { subscriberDetails } = requestBody
      
      const ownerEmailContent = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>إشعار اشتراك جديد</h2>
          <p><strong>الاسم:</strong> ${subscriberDetails.firstName} ${subscriberDetails.lastName}</p>
          <p><strong>البريد الإلكتروني:</strong> ${subscriberDetails.email}</p>
          <p><strong>طريقة الدفع:</strong> ${subscriberDetails.paymentMethod}</p>
          <p><strong>الموافقة على الرسائل الترويجية:</strong> ${subscriberDetails.promotionalConsent ? 'نعم' : 'لا'}</p>
          <p><strong>وقت التسجيل:</strong> ${new Date(subscriberDetails.timestamp).toLocaleString('ar-EG')}</p>
          <hr>
          <h3>New Subscription Alert</h3>
          <p><strong>Name:</strong> ${subscriberDetails.firstName} ${subscriberDetails.lastName}</p>
          <p><strong>Email:</strong> ${subscriberDetails.email}</p>
          <p><strong>Payment Method:</strong> ${subscriberDetails.paymentMethod}</p>
          <p><strong>Promotional Consent:</strong> ${subscriberDetails.promotionalConsent ? 'Yes' : 'No'}</p>
          <p><strong>Registration Time:</strong> ${new Date(subscriberDetails.timestamp).toLocaleString('en-US')}</p>
        </div>
      `

      console.log('Sending owner notification email')
      // Here you would send the email using your SMTP configuration
      // Replace this with actual email sending logic once SMTP is configured

    } else if (requestBody.isPromotionalEmail) {
      // Promotional email
      const { promotionalContent, subscriberName } = requestBody
      
      const promotionalEmailContent = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>مرحباً ${subscriberName}</h2>
          <div style="margin: 20px 0;">
            ${promotionalContent}
          </div>
          <hr>
          <p style="font-size: 12px; color: #666;">
            تم إرسال هذه الرسالة إليك لأنك وافقت على تلقي الرسائل الترويجية. 
            إذا كنت ترغب في إلغاء الاشتراك، يرجى الاتصال بنا.
          </p>
        </div>
      `

      console.log('Sending promotional email to:', requestBody.email)
      // Here you would send the promotional email using your SMTP configuration

    } else {
      // Payment confirmation email
      const { email, paymentMethod, amount, currency } = requestBody
      
      const confirmationEmailContent = `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>تأكيد الدفع</h2>
          <p>مرحباً،</p>
          <p>تم استلام دفعتك بنجاح!</p>
          <p><strong>طريقة الدفع:</strong> ${paymentMethod}</p>
          ${amount ? `<p><strong>المبلغ:</strong> ${amount} ${currency}</p>` : ''}
          <p>شكراً لك على اشتراكك في برنامج الاستثمار طويل الأمد.</p>
          <p>سيتم التواصل معك قريباً بتفاصيل البرنامج.</p>
          <hr>
          <h3>Payment Confirmation</h3>
          <p>Hello,</p>
          <p>Your payment has been received successfully!</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          ${amount ? `<p><strong>Amount:</strong> ${amount} ${currency}</p>` : ''}
          <p>Thank you for subscribing to our investment program.</p>
          <p>We will contact you soon with program details.</p>
        </div>
      `

      console.log('Sending payment confirmation email to:', email)
      // Here you would send the confirmation email using your SMTP configuration
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email processed successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Email processing error:', error)
    return new Response('Email processing error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
