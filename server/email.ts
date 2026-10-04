// Sends transactional emails via the Gmail integration (proxied through Replit Connectors).
// No API keys required — auth is handled by the connector.
import { ReplitConnectors } from "@replit/connectors-sdk";
import { formatIntake, type IntakeData } from "../shared/intake";

const connectors = new ReplitConnectors();

const ADMIN_EMAIL = "kyle@landonco.co";

export async function sendIntakeEmail(data: IntakeData): Promise<boolean> {
  const text = formatIntake(data);
  return sendViaGmail({
    to: ADMIN_EMAIL,
    subject: `New Client Intake: ${data.businessName || data.name}`,
    text,
    html: `<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;padding:24px">
      <h1 style="font-size:24px">New client intake</h1>
      <pre style="font-family:Arial,sans-serif;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6">${escapeHtml(text)}</pre>
      </div>`,
    replyTo: data.email,
  });
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

function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toBase64Url(input: string): string {
  return Buffer.from(input, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function toBase64(input: string): string {
  return Buffer.from(input, "utf-8").toString("base64");
}

// Strip CRLF and other control chars to prevent header injection.
function sanitizeHeaderValue(value: string): string {
  return String(value).replace(/[\r\n\t]+/g, " ").trim();
}

// Allow only http/https URLs for use in email href attributes.
function safeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function buildRawMessage({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): string {
  // RFC 2822 multipart/alternative message. Gmail's `from` is automatically
  // set to the connected account, so we omit the From header.
  const boundary = `landonco-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const subjectEncoded = `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;

  const safeTo = sanitizeHeaderValue(to);
  const safeReplyTo = replyTo ? sanitizeHeaderValue(replyTo) : null;

  const headers = [
    `To: ${safeTo}`,
    safeReplyTo ? `Reply-To: ${safeReplyTo}` : null,
    `Subject: ${subjectEncoded}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ]
    .filter(Boolean)
    .join("\r\n");

  // Use base64 transfer encoding for both parts so UTF-8 content (emoji,
  // accents, etc.) is conveyed safely.
  const body = [
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    toBase64(text),
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    toBase64(html),
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");

  return `${headers}\r\n\r\n${body}`;
}

async function sendViaGmail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  try {
    const raw = toBase64Url(buildRawMessage(opts));

    const response = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gmail send error:", response.status, errorBody);
      return false;
    }

    console.log(`Email sent via Gmail to ${opts.to}: ${opts.subject}`);
    return true;
  } catch (error) {
    console.error("Gmail send exception:", error);
    return false;
  }
}

export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  const text = `
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

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px">
  <h2 style="color:#111;margin-bottom:4px">📬 New Contact Form Submission</h2>
  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px">Contact Details</h4>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:4px 0;color:#666;width:140px">Name</td><td style="padding:4px 0;color:#111"><strong>${escapeHtml(formData.name)}</strong></td></tr>
    <tr><td style="padding:4px 0;color:#666">Email</td><td style="padding:4px 0;color:#111"><a href="mailto:${escapeHtml(formData.email)}">${escapeHtml(formData.email)}</a></td></tr>
    <tr><td style="padding:4px 0;color:#666">Phone</td><td style="padding:4px 0;color:#111">${escapeHtml(formData.phone || "—")}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Preferred Contact</td><td style="padding:4px 0;color:#111">${escapeHtml(formData.preferredContact || "—")}</td></tr>
  </table>
  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:20px">Project Information</h4>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:4px 0;color:#666;width:140px">Project Type</td><td style="padding:4px 0;color:#111">${escapeHtml(formData.project || "—")}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Budget</td><td style="padding:4px 0;color:#111">${escapeHtml(formData.budget || "—")}</td></tr>
  </table>
  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:20px">Message</h4>
  <p style="color:#333;white-space:pre-wrap">${escapeHtml(formData.message)}</p>
  <p style="margin-top:24px;font-size:12px;color:#999">Submitted via landonco.co contact form</p>
</div>
  `.trim();

  return sendViaGmail({
    to: ADMIN_EMAIL,
    subject: `New Contact Form - ${formData.name}`,
    text,
    html,
    replyTo: formData.email,
  });
}

export async function sendSubmissionEmail(data: SubmissionEmailData): Promise<boolean> {
  const text = `
New Project Submission - Landon & Co.

Project: ${data.projectTitle}

Client Details:
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone || "Not provided"}
• Company: ${data.companyName || "Not provided"}

Project Details:
• Type: ${data.projectType}
• Budget: ${data.budget}
• Timeline: ${data.timeline}
• Website: ${data.website || "Not provided"}

Description:
${data.description}
${data.additionalNotes ? `\nAdditional Notes:\n${data.additionalNotes}` : ""}

---
Submitted via landonco.co
  `.trim();

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px">
  <h2 style="color:#111;margin-bottom:4px">🚀 New Project Submission</h2>
  <h3 style="color:#444;margin-top:0">${escapeHtml(data.projectTitle)}</h3>

  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px">Client Details</h4>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:4px 0;color:#666;width:130px">Name</td><td style="padding:4px 0;color:#111"><strong>${escapeHtml(data.name)}</strong></td></tr>
    <tr><td style="padding:4px 0;color:#666">Email</td><td style="padding:4px 0;color:#111"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
    <tr><td style="padding:4px 0;color:#666">Phone</td><td style="padding:4px 0;color:#111">${escapeHtml(data.phone || "Not provided")}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Company</td><td style="padding:4px 0;color:#111">${escapeHtml(data.companyName || "Not provided")}</td></tr>
  </table>

  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:20px">Project Details</h4>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:4px 0;color:#666;width:130px">Type</td><td style="padding:4px 0;color:#111">${escapeHtml(data.projectType)}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Budget</td><td style="padding:4px 0;color:#111">${escapeHtml(data.budget)}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Timeline</td><td style="padding:4px 0;color:#111">${escapeHtml(data.timeline)}</td></tr>
    <tr><td style="padding:4px 0;color:#666">Website</td><td style="padding:4px 0;color:#111">${(() => {
      const safe = safeUrl(data.website ?? null);
      return safe ? `<a href="${escapeHtml(safe)}">${escapeHtml(safe)}</a>` : "Not provided";
    })()}</td></tr>
  </table>

  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:20px">Description</h4>
  <p style="color:#333;white-space:pre-wrap">${escapeHtml(data.description)}</p>

  ${data.additionalNotes ? `
  <h4 style="color:#555;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:20px">Additional Notes</h4>
  <p style="color:#333;white-space:pre-wrap">${escapeHtml(data.additionalNotes)}</p>
  ` : ""}

  <p style="margin-top:24px;font-size:12px;color:#999">Submitted via landonco.co</p>
</div>
  `.trim();

  return sendViaGmail({
    to: ADMIN_EMAIL,
    subject: `New Project Submission: ${data.projectTitle} — ${data.name}`,
    text,
    html,
    replyTo: data.email,
  });
}
