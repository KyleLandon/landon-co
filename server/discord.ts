import { formatIntake, type IntakeData } from "../shared/intake";

const webhookUrl = process.env.LANDONCO_DISCORD_SUBMISSION_HOOK;

/** Full answers travel as an attachment, avoiding Discord embed truncation. */
export async function sendIntakeDiscordNotification(data: IntakeData): Promise<boolean> {
  if (!webhookUrl) {
    console.error("Intake Discord notification unavailable: webhook not configured.");
    return false;
  }
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: buildIntakeDiscordForm(data),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      console.error("Intake Discord notification failed:", response.status);
      return false;
    }
    return true;
  } catch {
    console.error("Intake Discord notification could not be delivered.");
    return false;
  }
}

export function buildIntakeDiscordForm(data: IntakeData): FormData {
  const payload = {
    username: "Landon & Co.",
    allowed_mentions: { parse: [] },
    embeds: [{
      title: "New client intake",
      color: 0xffffff,
      description: "Complete questionnaire attached as client-intake.txt.",
      fields: [
        { name: "Business", value: data.businessName || "Not provided", inline: true },
        { name: "Name & role", value: data.name, inline: true },
        { name: "Email", value: data.email, inline: true },
        { name: "Phone", value: data.phone || "Not provided", inline: true },
      ],
      timestamp: new Date().toISOString(),
    }],
    attachments: [{ id: 0, filename: "client-intake.txt", description: "Complete client intake questionnaire" }],
  };
  const form = new FormData();
  form.append("payload_json", JSON.stringify(payload));
  form.append("files[0]", new Blob([formatIntake(data)], { type: "text/plain;charset=utf-8" }), "client-intake.txt");
  return form;
}

if (!webhookUrl) {
  console.warn("LANDONCO_DISCORD_SUBMISSION_HOOK is not set — Discord notifications will be disabled.");
}

interface SubmissionData {
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

export async function sendDiscordSubmissionNotification(data: SubmissionData): Promise<boolean> {
  if (!webhookUrl) {
    console.warn("Discord notification skipped: webhook not configured.");
    return false;
  }

  try {
    const fields = [
      { name: "👤 Name", value: data.name, inline: true },
      { name: "📧 Email", value: data.email, inline: true },
      { name: "📱 Phone", value: data.phone || "Not provided", inline: true },
      { name: "🏢 Company", value: data.companyName || "Not provided", inline: true },
      { name: "🗂️ Project Type", value: data.projectType, inline: true },
      { name: "💰 Budget", value: data.budget, inline: true },
      { name: "⏱️ Timeline", value: data.timeline, inline: true },
      { name: "🌐 Website", value: data.website || "Not provided", inline: true },
      { name: "📝 Description", value: data.description.slice(0, 1024), inline: false },
    ];

    if (data.additionalNotes) {
      fields.push({ name: "📌 Additional Notes", value: data.additionalNotes.slice(0, 1024), inline: false });
    }

    const payload = {
      username: "Landon & Co.",
      avatar_url: "https://landonco.co/favicon.ico",
      embeds: [
        {
          title: `🚀 New Project Submission: ${data.projectTitle}`,
          color: 0x00ff88,
          fields,
          footer: { text: "Submitted via landonco.co" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Discord webhook error:", response.status, await response.text());
      return false;
    }

    console.log("Discord notification sent successfully.");
    return true;
  } catch (error) {
    console.error("Discord notification error:", error);
    return false;
  }
}
