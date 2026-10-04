import { intakeSections, type IntakeData } from "../shared/intake";

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
// escape sequence. No answer is truncated to fit Discord's 1,024-character fields.
export function discordAnswerChunks(answer: string): string[] {
  const chunks: string[] = [];
  let chunk = "";
  for (const character of Array.from(answer || "Not provided")) {
    const escaped = /[\\`*_~|>]/.test(character) ? `\\${character}` : character;
    if (chunk.length + escaped.length > 1000) {
      chunks.push(chunk);
      chunk = "";
    }
    chunk += escaped;
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

export function buildIntakeDiscordMessages(data: IntakeData) {
  const embeds: IntakeEmbed[] = [];
  for (const section of intakeSections) {
    const makeEmbed = (continued: boolean): IntakeEmbed => ({
      title: `${section.number} · ${section.title}${continued ? " — continued" : ""}`,
      description: section.subtitle,
      color: 0xd8c6a5,
      fields: [],
      footer: { text: "Landon & Co. · Client intake" },
    });
    let embed = makeEmbed(false);
    for (const field of section.fields) {
      const answer = data[field.name];
      const value = Array.isArray(answer) ? answer.join("\n") : answer;
      const chunks = discordAnswerChunks(value);
      chunks.forEach((chunk, index) => {
        const item = {
          name: `${field.label}${index ? " (continued)" : ""}`,
          value: chunk,
          inline: section.number === "01" && chunks.length === 1 && chunk.length < 100,
        };
        if (embed.fields.length >= 25 || embedLength(embed) + item.name.length + item.value.length > 5400) {
          embeds.push(embed);
          embed = makeEmbed(true);
        }
        embed.fields.push(item);
      });
    }
    embeds.push(embed);
  }
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
    content: `**New client intake**${groups.length > 1 ? ` · Part ${index + 1} of ${groups.length}` : ""}`,
    embeds,
  }));
}