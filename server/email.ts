import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
} else {
  console.warn("SENDGRID_API_KEY is not set — contact form emails will be disabled.");
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  project: string;
  budget: string;
  message: string;
}

export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  if (!apiKey) {
    console.warn('Email not sent: SENDGRID_API_KEY is not configured');
    return false;
  }

  try {
    const emailContent = `
New Contact Form Submission - Landon & Co.

Contact Details:
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Preferred Contact: ${formData.preferredContact}

Project Information:
• Project Type: ${formData.project}
• Budget: ${formData.budget}

Message:
${formData.message}

---
Submitted via landonco.co contact form
    `.trim();

    const msg = {
      to: 'info@landonco.co',
      from: 'kylelandon@gmail.com',
      subject: `New Contact Form - ${formData.name}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>').replace(/•/g, '&bull;'),
      replyTo: formData.email,
    };

    await sgMail.send(msg);
    console.log('Contact form email sent successfully');
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}
