import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
} else {
  console.warn("SENDGRID_API_KEY is not set — email notifications will be disabled.");
}

const ADMIN_EMAIL = 'kyle@landonco.co';
const FROM_EMAIL = 'kylelandon@gmail.com';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  project: string;
  budget: string;
  message: string;
}

interface SubmissionEmailData {
  name: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  projectTitle: string;
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
  website?: string | null;
  additionalNotes?: string | null;
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
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
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

export async function sendSubmissionEmail(data: SubmissionEmailData): Promise<boolean> {
  if (!apiKey) {
    console.warn('Submission email not sent: SENDGRID_API_KEY is not configured');
    return false;
  }

  try {
    const text = `
New Project Submission - Landon & Co.

Project: ${data.projectTitle}

Client Details:
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone || 'Not provided'}
• Company: ${data.companyName || 'Not provided'}

Project Details:
• Type: ${data.projectType}
• Budget: ${data.budget}
• Timeline: ${data.timeline}
• Website: ${data.website || 'Not provided'}

Description:
${data.description}
${data.additionalNotes ? `\nAdditional Notes:\n${data.additionalNotes}` : ''}

---
Submitted via landonco.co
    `.trim();

    const html = `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px">
  <h2 style="color:#111;margin-bottom:4px">🚀 New Project Submission</h2>
  <h3 style="color:#444;margin-top:0">${data.projectTitle}</h3>

  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px">Client Details</h4>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:4px 0;color:#666;width:130px">Name</td><td style="padding:4px 0;color:#111"><strong>${data.name}</strong></td></tr>
    <tr><td style="padding:4px 0;color:#666">Email</td><td style="padding:4px 0;color:#111"><a href="mailto:${data.email}">${data.email}</a></td></tr>
    <tr><td style="padding:4px 0;color:#666">Phone</td><td style="padding:4px 0;color:#111">${data.phone || 'Not provided'}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Company</td><td style="padding:4px 0;color:#111">${data.companyName || 'Not provided'}</td></tr>
  </table>

  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:20px">Project Details</h4>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:4px 0;color:#666;width:130px">Type</td><td style="padding:4px 0;color:#111">${data.projectType}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Budget</td><td style="padding:4px 0;color:#111">${data.budget}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Timeline</td><td style="padding:4px 0;color:#111">${data.timeline}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Website</td><td style="padding:4px 0;color:#111">${data.website ? `<a href="${data.website}">${data.website}</a>` : 'Not provided'}</td></tr>
  </table>

  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:20px">Description</h4>
  <p style="color:#333;white-space:pre-wrap">${data.description}</p>

  ${data.additionalNotes ? `
  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:20px">Additional Notes</h4>
  <p style="color:#333;white-space:pre-wrap">${data.additionalNotes}</p>
  ` : ''}

  <p style="margin-top:24px;font-size:12px;color:#999">Submitted via landonco.co</p>
</div>
    `.trim();

    const msg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `New Project Submission: ${data.projectTitle} — ${data.name}`,
      text,
      html,
      replyTo: data.email,
    };

    await sgMail.send(msg);
    console.log('Submission email sent successfully');
    return true;
  } catch (error) {
    console.error('Submission email error:', error);
    return false;
  }
}
