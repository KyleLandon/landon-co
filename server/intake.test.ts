import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { intakeSchema, intakeSections, formatIntake } from "../shared/intake";
import { createIntakeHandler, toSubmission } from "./intake";
import { buildIntakeDiscordMessages, discordAnswerChunks, embedLength } from "./discord-intake";

const minimal = { name: "Intake test", email: "intake-test@example.com" };

test("all eight PDF sections are represented and optional fields may be skipped", () => {
  const data = intakeSchema.parse(minimal);
  assert.equal(intakeSections.length, 8);
  assert.deepEqual(
    intakeSections.flatMap(s => s.fields.map(f => f.name)).sort(),
    Object.keys(intakeSchema.shape).filter(key => key !== "faxNumber").sort(),
  );
  assert.deepEqual(data.goals, []);
  assert.equal(data.logo, "");
  const stored = toSubmission(data);
  assert.equal(stored.projectType, "Website intake");
  for (const section of intakeSections) {
    assert.ok(stored.additionalNotes?.includes(section.title.toUpperCase()));
    for (const field of section.fields) assert.ok(stored.additionalNotes?.includes(field.label));
  }
});

test("validation rejects missing identity, invalid email, oversized text, unknown options and bot fields", () => {
  for (const input of [
    {}, { ...minimal, name: " " }, { ...minimal, email: "invalid" },
    { ...minimal, businessDescription: "x".repeat(3001) },
    { ...minimal, goals: ["not an option"] }, { ...minimal, logo: "invalid" },
    { ...minimal, faxNumber: "spam" },
  ]) assert.equal(intakeSchema.safeParse(input).success, false);
});

test("long answers and Other selections survive storage and Discord cards without truncation", async () => {
  const data = intakeSchema.parse({
    ...minimal, businessName: "Test business", goals: ["Other", "Get more phone calls"],
    otherGoal: "Special goal", features: ["Other", "Contact form"], otherFeature: "Special feature",
    additionalNotes: "A".repeat(3000), inspiration: "B".repeat(3000),
  });
  const text = formatIntake(data);
  assert.ok(text.includes("A".repeat(3000)));
  assert.ok(text.includes("Special feature"));
  assert.equal(toSubmission(data).additionalNotes, text);
  const messages = buildIntakeDiscordMessages(data);
  assert.ok(messages.length > 1);
  const fields = messages.flatMap(message => message.embeds.flatMap(embed => embed.fields));
  assert.equal(fields.filter(field => field.name.startsWith("Deadlines")).map(field => field.value).join(""), "A".repeat(3000));
  assert.equal(fields.filter(field => field.name.startsWith("Websites or brands")).map(field => field.value).join(""), "B".repeat(3000));
  assert.ok(fields.some(field => field.value === "Special feature"));
  for (const message of messages) {
    assert.deepEqual(message.allowed_mentions, { parse: [] });
    assert.ok(message.embeds.length <= 10);
    assert.ok(message.embeds.reduce((sum, embed) => sum + embedLength(embed), 0) <= 6000);
    for (const embed of message.embeds) {
      assert.ok(embed.title.length <= 256);
      assert.ok(embed.fields.length <= 25);
      assert.ok(embed.fields.every(field => field.value.length <= 1024 && field.name.length <= 256));
    }
  }
});

test("Discord escapes formatting and preserves Unicode across chunk boundaries", () => {
  const raw = "**bold** @everyone " + "😀".repeat(2000);
  const chunks = discordAnswerChunks(raw);
  assert.equal(chunks.join(""), "\\*\\*bold\\*\\* @everyone " + "😀".repeat(2000));
  assert.ok(chunks.every(chunk => chunk.length <= 1000 && !/[\uD800-\uDBFF]$/.test(chunk)));
});

test("maximum-length answers remain within every Discord message limit", () => {
  const input: Record<string, unknown> = { ...minimal };
  for (const section of intakeSections) {
    for (const field of section.fields) {
      if (field.kind === "textarea") input[field.name] = "*".repeat(3000);
      else if (field.kind === "checkbox") input[field.name] = [...field.options!];
      else if (field.kind === "radio") input[field.name] = field.options![0];
      else if (!field.required) input[field.name] = "*".repeat(500);
    }
  }
  const messages = buildIntakeDiscordMessages(intakeSchema.parse(input));
  for (const message of messages) {
    assert.ok(message.embeds.length <= 10);
    assert.ok(message.embeds.reduce((sum, embed) => sum + embedLength(embed), 0) <= 6000);
    assert.ok(message.embeds.every(embed => embed.fields.length <= 25 && embed.fields.every(field => field.value.length <= 1024)));
  }
});

async function exercise(body: unknown, options: { authenticated?: boolean; failSave?: boolean; failEmail?: boolean; failDiscord?: boolean } = {}) {
  const calls: string[] = [];
  let saved: unknown;
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    if (options.authenticated) {
      (req as any).user = { claims: { sub: "existing-user" } };
      (req as any).isAuthenticated = () => true;
    }
    next();
  });
  app.post("/api/project-submissions", createIntakeHandler({
    save: async data => { calls.push("save"); if (options.failSave) throw new Error("storage failure"); saved = data; return { id: 123 }; },
    email: async () => { calls.push("email"); if (options.failEmail) throw new Error("provider failure"); return true; },
    discord: async () => { calls.push("discord"); return !options.failDiscord; },
  }));
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.on("listening", resolve));
  try {
    const address = server.address() as { port: number };
    const response = await fetch(`http://127.0.0.1:${address.port}/api/project-submissions`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    return { status: response.status, result: await response.json(), calls, saved };
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
}

test("anonymous submission saves and sends both notifications without creating accounts or projects", async () => {
  const result = await exercise(minimal);
  assert.equal(result.status, 201);
  assert.equal(result.result.success, true);
  assert.deepEqual(result.calls, ["save", "email", "discord"]);
  assert.equal(result.result.project, undefined);
  assert.equal(result.result.submission.id, 123);
});

test("existing authenticated customers use the same account-free submission path", async () => {
  const result = await exercise(minimal, { authenticated: true });
  assert.equal(result.status, 201);
  assert.deepEqual(result.calls, ["save", "email", "discord"]);
  assert.equal(result.result.project, undefined);
});

test("invalid requests never store or notify", async () => {
  const result = await exercise({ ...minimal, email: "not-email" });
  assert.equal(result.status, 400);
  assert.deepEqual(result.calls, []);
  assert.ok(result.result.errors.email);
});

test("database failure permits retry and never sends an unsaved intake", async () => {
  const result = await exercise(minimal, { failSave: true });
  assert.equal(result.status, 500);
  assert.equal(result.result.success, false);
  assert.deepEqual(result.calls, ["save"]);
});

test("delivery failure preserves the intake, still attempts both channels, and reports delay", async () => {
  const result = await exercise(minimal, { failEmail: true, failDiscord: true });
  assert.equal(result.status, 201);
  assert.ok(result.saved);
  assert.deepEqual(result.calls, ["save", "email", "discord"]);
  assert.match(result.result.message, /notification is delayed/);
});