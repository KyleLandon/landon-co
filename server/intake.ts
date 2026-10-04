import type { RequestHandler } from "express";
import { intakeSchema, formatIntake, type IntakeData } from "../shared/intake";
import type { InsertProjectSubmission } from "../shared/schema";

interface IntakeDependencies {
  save: (data: InsertProjectSubmission) => Promise<{ id: number }>;
  email: (data: IntakeData) => Promise<boolean>;
  discord: (data: IntakeData) => Promise<boolean>;
}

export function toSubmission(data: IntakeData): InsertProjectSubmission {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    companyName: data.businessName || null,
    projectTitle: `${data.businessName || data.name} — Website intake`,
    projectType: "Website intake",
    description: data.businessDescription || "See full client intake in additional notes.",
    budget: "See intake notes",
    timeline: "See intake notes",
    website: data.website || null,
    additionalNotes: formatIntake(data),
  };
}

/** Public intake never creates a customer account or a managed project. */
export function createIntakeHandler(dependencies: IntakeDependencies): RequestHandler {
  return async (req, res) => {
    const parsed = intakeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Please check the highlighted fields and try again.",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      // Save first, so a delivery outage never loses a customer's answers.
      const submission = await dependencies.save(toSubmission(parsed.data));
      const results = await Promise.allSettled([
        dependencies.email(parsed.data),
        dependencies.discord(parsed.data),
      ]);
      const emailSent = results[0].status === "fulfilled" && results[0].value;
      const discordSent = results[1].status === "fulfilled" && results[1].value;
      if (!emailSent || !discordSent) {
        // No submitted personal information or provider credentials in logs.
        console.error("Intake notification delivery incomplete", {
          submissionId: submission.id, emailSent, discordSent,
        });
      }
      res.status(201).json({
        success: true,
        message: emailSent && discordSent
          ? "Your intake has been received. We'll review your answers and be in touch soon."
          : "Your intake has been saved. A notification is delayed, but you do not need to submit again.",
        submission: { id: submission.id },
      });
    } catch {
      console.error("Unable to save client intake.");
      res.status(500).json({
        success: false,
        message: "We couldn't save your intake. Your answers are still here — please try again.",
      });
    }
  };
}