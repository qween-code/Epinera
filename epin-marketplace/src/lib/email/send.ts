const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@epinera.com';

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set, skipping email send');
    return { success: false, error: 'API key not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('[Email] Send failed:', err);
      return { success: false, error: err.message };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error('[Email] Error:', error);
    return { success: false, error: 'Network error' };
  }
}
