import { type IntakeData, type IntakeFieldName } from "../shared/intake";

const compactGroups: { title: string; fields: [IntakeFieldName, string][] }[] = [
  { title: "Contact", fields: [["businessName", "Business"], ["name", "Name / role"], ["email", "Email"], ["phone", "Phone"]] },
  { title: "Business", fields: [["businessDescription", "About"], ["idealCustomer", "Customers"], ["differentiators", "What sets you apart"], ["address", "Address"], ["businessHours", "Hours"]] },
  { title: "Website", fields: [["goals", "Goals"], ["otherGoal", "Other goal"], ["successVision", "Success"], ["features", "Features"], ["otherFeature", "Other feature"]] },
  { title: "Brand & content", fields: [["logo", "Logo"], ["brandStyle", "Colors / fonts"], ["textContent", "Copy"], ["photos", "Photos"], ["testimonials", "Reviews"]] },
  { title: "Links & access", fields: [["website", "Website"], ["socialLinks", "Socials"], ["inspiration", "Inspiration"], ["domain", "Domain / registrar"], ["hosting", "Hosting"], ["googleBusiness", "Google Business"]] },
  { title: "Notes", fields: [["additionalNotes", "Notes"]] },
];

interface IntakeEmbed {
  title: string;
  description?: string;
  color: number;
  fields: { name: string; value: string; inline: boolean }[];
  footer: { text: string };
}

export function embedLength(embed: IntakeEmbed): number {
  return embed.title.length + (embed.description?.length || 0) + embed.footer.text.length +
    embed.fields.reduce((sum, field) => sum + field.name.length + field.value.length, 0);
}

// Escape submitted Markdown and split without cutting a Unicode character or
// escape sequence. Keep normal URLs intact and clickable across chunk boundaries.
// No answer is truncated to fit Discord's 1,024-character fields.
export function discordAnswerChunks(answer: string): string[] {
  const chunks: string[] = [];
  let chunk = "";
  const append = (escaped: string) => {
    if (chunk.length + escaped.length > 1000) {
      chunks.push(chunk);
      chunk = "";
    }
    chunk += escaped;
  };
  for (const token of answer.split(/(https?:\/\/[^\s<>]+)/g)) {
    if (/^https?:\/\//.test(token) && token.length <= 998) {
      append(`<${token}>`);
    } else {
      for (const character of Array.from(token)) {
        append(/[\\`*_~|>]/.test(character) ? `\\${character}` : character);
      }
    }
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

export function buildIntakeDiscordMessages(data: IntakeData) {
  const embeds: IntakeEmbed[] = [];
  const makeEmbed = (continued: boolean): IntakeEmbed => ({
    title: continued ? "Client intake — continued" : "New client intake",
    color: 0xd8c6a5,
    fields: [],
    footer: { text: "Landon & Co." },
  });
  let embed = makeEmbed(false);
  for (const group of compactGroups) {
    const lines = group.fields.flatMap(([key, label]) => {
      const answer = data[key];
      const value = Array.isArray(answer) ? answer.join(", ") : answer;
      return value.trim() ? [group.title === "Notes" ? value : `${label}: ${value}`] : [];
    });
    if (!lines.length) continue;
    const chunks = discordAnswerChunks(lines.join("\n"));
    chunks.forEach((chunk, index) => {
        const item = {
          name: `${group.title}${index ? " (continued)" : ""}`,
          value: chunk,
          inline: chunks.length === 1 && chunk.length < 200 && group.title !== "Notes",
        };
        if (embed.fields.length >= 25 || embedLength(embed) + item.name.length + item.value.length > 5400) {
          embeds.push(embed);
          embed = makeEmbed(true);
        }
        embed.fields.push(item);
    });
  }
  if (embed.fields.length) embeds.push(embed);
  // Discord allows 10 embeds, with 6,000 combined embed characters per message.
  const groups: IntakeEmbed[][] = [];
  let group: IntakeEmbed[] = [];
  let length = 0;
  for (const embed of embeds) {
    const size = embedLength(embed);
    if (group.length >= 10 || length + size > 5600) {
      groups.push(group);
      group = [];
      length = 0;
    }
    group.push(embed);
    length += size;
  }
  if (group.length) groups.push(group);
  return groups.map((embeds, index) => ({
    username: "Landon & Co.",
    allowed_mentions: { parse: [] },
    ...(groups.length > 1 ? { content: `Intake · Part ${index + 1} of ${groups.length}` } : {}),
    embeds,
  }));
}