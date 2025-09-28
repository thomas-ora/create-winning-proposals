import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  template?: string
  templateData?: Record<string, any>
  type?: 'proposal_created' | 'proposal_viewed' | 'proposal_accepted' | 'api_key_created' | 'payment_success'
}

// Email templates
const templates = {
  proposal_created: (data: any) => ({
    subject: `New Proposal Created: ${data.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7B7FEB; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 10px 20px; background: #7B7FEB; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Proposal Created Successfully</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.clientName},</h2>
              <p>Your proposal "${data.title}" has been created and is ready to view.</p>
              <p><strong>Proposal Details:</strong></p>
              <ul>
                <li>Client: ${data.clientName}</li>
                <li>Company: ${data.companyName}</li>
                <li>Value: ${data.currency} ${data.value}</li>
                <li>Valid Until: ${data.validUntil}</li>
              </ul>
              <p>You can view your proposal using the link below:</p>
              <a href="${data.proposalUrl}" class="button">View Proposal</a>
              ${data.password ? `<p><strong>Password:</strong> ${data.password}</p>` : ''}
              <div class="footer">
                <p>This proposal will expire on ${data.validUntil}. Please review and respond before the expiration date.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Proposal Created Successfully

      Hello ${data.clientName},

      Your proposal "${data.title}" has been created and is ready to view.

      Proposal Details:
      - Client: ${data.clientName}
      - Company: ${data.companyName}
      - Value: ${data.currency} ${data.value}
      - Valid Until: ${data.validUntil}

      View your proposal: ${data.proposalUrl}
      ${data.password ? `Password: ${data.password}` : ''}

      This proposal will expire on ${data.validUntil}.
    `
  }),

  proposal_viewed: (data: any) => ({
    subject: `Proposal Viewed: ${data.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Proposal Viewed</h1>
            </div>
            <div class="content">
              <p>Your proposal "${data.title}" was viewed by ${data.clientName} from ${data.companyName}.</p>
              <p><strong>View Details:</strong></p>
              <ul>
                <li>Time: ${new Date(data.viewedAt).toLocaleString()}</li>
                <li>Duration: ${data.duration} seconds</li>
                <li>Sections viewed: ${data.sectionsViewed}</li>
                <li>IP Address: ${data.ipAddress}</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Proposal Viewed

      Your proposal "${data.title}" was viewed by ${data.clientName} from ${data.companyName}.

      View Details:
      - Time: ${new Date(data.viewedAt).toLocaleString()}
      - Duration: ${data.duration} seconds
      - Sections viewed: ${data.sectionsViewed}
      - IP Address: ${data.ipAddress}
    `
  }),

  proposal_accepted: (data: any) => ({
    subject: `🎉 Proposal Accepted: ${data.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .success-box { background: #D1FAE5; border: 2px solid #059669; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
            </div>
            <div class="content">
              <div class="success-box">
                <h2>Proposal Accepted!</h2>
                <p>${data.clientName} from ${data.companyName} has accepted your proposal "${data.title}".</p>
              </div>
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Review the accepted terms</li>
                <li>Prepare the contract</li>
                <li>Schedule kickoff meeting</li>
                <li>Begin project setup</li>
              </ol>
              <p><strong>Acceptance Details:</strong></p>
              <ul>
                <li>Accepted Value: ${data.currency} ${data.value}</li>
                <li>Accepted At: ${new Date(data.acceptedAt).toLocaleString()}</li>
                <li>Start Date: ${data.startDate}</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Congratulations! Proposal Accepted!

      ${data.clientName} from ${data.companyName} has accepted your proposal "${data.title}".

      Next Steps:
      1. Review the accepted terms
      2. Prepare the contract
      3. Schedule kickoff meeting
      4. Begin project setup

      Acceptance Details:
      - Accepted Value: ${data.currency} ${data.value}
      - Accepted At: ${new Date(data.acceptedAt).toLocaleString()}
      - Start Date: ${data.startDate}
    `
  })
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailRequest: EmailRequest = await req.json()

    // Get email service configuration from environment
    const EMAIL_SERVICE = Deno.env.get('EMAIL_SERVICE') || 'console'
    const EMAIL_API_KEY = Deno.env.get('EMAIL_API_KEY')
    const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'noreply@proposals.com'

    // Prepare email content
    let subject = emailRequest.subject
    let html = emailRequest.html
    let text = emailRequest.text

    // Use template if specified
    if (emailRequest.type && templates[emailRequest.type]) {
      const template = templates[emailRequest.type](emailRequest.templateData)
      subject = template.subject
      html = template.html
      text = template.text
    }

    // Send email based on service
    switch (EMAIL_SERVICE) {
      case 'sendgrid':
        // SendGrid implementation
        const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${EMAIL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: Array.isArray(emailRequest.to)
                ? emailRequest.to.map(email => ({ email }))
                : [{ email: emailRequest.to }]
            }],
            from: { email: EMAIL_FROM },
            subject,
            content: [
              { type: 'text/plain', value: text },
              { type: 'text/html', value: html }
            ]
          })
        })

        if (!sgResponse.ok) {
          throw new Error(`SendGrid error: ${await sgResponse.text()}`)
        }
        break

      case 'resend':
        // Resend implementation
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${EMAIL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: emailRequest.to,
            subject,
            html,
            text
          })
        })

        if (!resendResponse.ok) {
          throw new Error(`Resend error: ${await resendResponse.text()}`)
        }
        break

      case 'console':
      default:
        // Log to console for development
        console.log('📧 Email would be sent:')
        console.log('To:', emailRequest.to)
        console.log('Subject:', subject)
        console.log('Content:', text)
        break
    }

    // Log email event to database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase.from('email_logs').insert({
      to: emailRequest.to,
      subject,
      type: emailRequest.type,
      service: EMAIL_SERVICE,
      sent_at: new Date().toISOString(),
      status: 'sent'
    })

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})