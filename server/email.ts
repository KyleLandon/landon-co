import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      from: 'noreply@landonco.co', // You may need to verify this domain in SendGrid
      subject: `New Contact Form - ${formData.name}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>').replace(/•/g, '&bull;'),
    };

    await sgMail.send(msg);
    console.log('Contact form email sent successfully');
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}