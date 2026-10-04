import { type IntakeData } from "../shared/intake";
import { buildIntakeDiscordMessages } from "./discord-intake";

const webhookUrl = process.env.LANDONCO_DISCORD_SUBMISSION_HOOK;

/** Readable section cards, split across messages when Discord's limits require it. */
export async function sendIntakeDiscordNotification(data: IntakeData): Promise<boolean> {
  if (!webhookUrl) {
    console.error("Intake Discord notification unavailable: webhook not configured.");
    return false;
  }
  try {
    for (const payload of buildIntakeDiscordMessages(data)) {
      const send = () => fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      let response = await send();
      if (response.status === 429) {
        const limit = await response.json();
        const delay = Number(limit.retry_after);
        if (Number.isFinite(delay) && delay >= 0 && delay <= 5) {
          await new Promise(resolve => setTimeout(resolve, Math.ceil(delay * 1000) + 100));
          response = await send();
        }
      }
      if (!response.ok) {
        console.error("Intake Discord notification failed:", response.status);
        return false;
      }
    }
    return true;
  } catch {
    console.error("Intake Discord notification could not be delivered.");
    return false;
  }
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
