// SMS notifications via AT&T's email-to-SMS gateway, using the Gmail
// integration. Free, no API keys. Texts are limited to ~160 chars per
// segment, so messages are kept short.
import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

// Optional explicitly configured carrier gateway; do not assume the business
// Google Voice number uses AT&T's email-to-SMS service.
// Format: <10-digit-number>@<carrier-gateway>
const SMS_TO = process.env.OWNER_SMS_GATEWAY;

interface ContactSmsData {
  name: string;
  email: string;
  phone?: string | null;
  project?: string | null;
  budget?: string | null;
  message: string;
}

interface SubmissionSmsData {
  name: string;
  email: string;
  phone?: string | null;
  projectTitle: string;
  budget?: string | null;
  timeline?: string | null;
}

function toBase64Url(input: string): string {
  return Buffer.from(input, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sanitize(value: string): string {
  return String(value).replace(/[\r\n\t]+/g, " ").trim();
}

// Truncate to fit a single SMS segment when possible.
function clip(value: string, max: number): string {
  const v = sanitize(value);
  return v.length > max ? v.slice(0, max - 1) + "…" : v;
}

async function sendSmsViaGmail(body: string): Promise<boolean> {
  if (!SMS_TO) {
    console.warn("SMS notification not sent: OWNER_SMS_GATEWAY is not configured.");
    return false;
  }
  try {
    // Plain-text RFC 2822. Carrier gateways strip subject lines into the
    // SMS body in some cases — keeping subject empty avoids prefixed noise.
    const message = [
      `To: ${SMS_TO}`,
      "Subject: ",
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "",
      body,
    ].join("\r\n");

    const raw = toBase64Url(message);

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
      console.error("SMS gateway send error:", response.status, errorBody);
      return false;
    }

    console.log(`SMS sent via gateway to ${SMS_TO}`);
    return true;
  } catch (error) {
    console.error("SMS send exception:", error);
    return false;
  }
}

export async function sendContactSms(data: ContactSmsData): Promise<boolean> {
  const lines = [
    `New contact: ${clip(data.name, 30)}`,
    data.phone ? `Ph: ${clip(data.phone, 20)}` : null,
    `Em: ${clip(data.email, 40)}`,
    data.project ? `Re: ${clip(data.project, 30)}` : null,
    data.budget ? `Budget: ${clip(data.budget, 20)}` : null,
    `Msg: ${clip(data.message, 80)}`,
  ].filter(Boolean);

  // Stay under ~300 chars total (2 segments) for reliability.
  const body = lines.join("\n").slice(0, 300);
  return sendSmsViaGmail(body);
}

export async function sendSubmissionSms(
  data: SubmissionSmsData,
): Promise<boolean> {
  const lines = [
    `New project: ${clip(data.projectTitle, 40)}`,
    `From: ${clip(data.name, 30)}`,
    data.phone ? `Ph: ${clip(data.phone, 20)}` : null,
    `Em: ${clip(data.email, 40)}`,
    data.budget ? `Budget: ${clip(data.budget, 20)}` : null,
    data.timeline ? `When: ${clip(data.timeline, 20)}` : null,
  ].filter(Boolean);

  const body = lines.join("\n").slice(0, 300);
  return sendSmsViaGmail(body);
}
