import { z } from "zod";

export const goalOptions = [
  "Get more phone calls", "Take online orders", "Let customers book/schedule online",
  "Sell products online", "Look more professional / build trust", "Show up on Google searches", "Other",
] as const;
export const featureOptions = [
  "Contact form", "Online ordering", "Booking / scheduling", "Photo gallery",
  "Online store", "Menu / services list", "Careers page", "Blog / news", "Other",
] as const;
export const logoOptions = ["Yes, and I love it", "Yes, but it needs a refresh", "No — I need one"] as const;
export const textOptions = ["I'll provide it", "I have some — need help polishing", "Please write it for me"] as const;
export const photoOptions = ["Professional photos ready", "Phone photos only", "I need photos taken"] as const;

const shortText = z.string().trim().max(500, "Please use 500 characters or fewer.").default("");
const longText = z.string().trim().max(3000, "Please use 3,000 characters or fewer.").default("");
export const intakeSchema = z.object({
  businessName: shortText,
  name: z.string().trim().min(1, "Please enter your name and role.").max(200),
  phone: shortText,
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  address: shortText,
  businessHours: shortText,
  website: shortText,
  socialLinks: longText,
  businessDescription: longText,
  idealCustomer: longText,
  differentiators: longText,
  goals: z.array(z.enum(goalOptions)).max(goalOptions.length).default([]),
  otherGoal: shortText,
  successVision: longText,
  logo: z.enum(["", ...logoOptions]).default(""),
  brandStyle: longText,
  inspiration: longText,
  textContent: z.enum(["", ...textOptions]).default(""),
  photos: z.enum(["", ...photoOptions]).default(""),
  testimonials: longText,
  features: z.array(z.enum(featureOptions)).max(featureOptions.length).default([]),
  otherFeature: shortText,
  domain: shortText,
  hosting: shortText,
  googleBusiness: longText,
  additionalNotes: longText,
  faxNumber: z.string().max(0).default(""),
});
export type IntakeData = z.infer<typeof intakeSchema>;
export type IntakeFieldName = Exclude<keyof IntakeData, "faxNumber">;
export interface IntakeField {
  name: IntakeFieldName;
  label: string;
  kind?: "textarea" | "checkbox" | "radio" | "email" | "tel";
  options?: readonly string[];
  required?: boolean;
}
export const intakeSections: { number: string; title: string; subtitle: string; note?: string; fields: IntakeField[] }[] = [
  { number: "01", title: "The basics", subtitle: "Your business.", fields: [
    { name: "businessName", label: "Business name" },
    { name: "name", label: "Your name & role", required: true },
    { name: "phone", label: "Phone", kind: "tel" },
    { name: "email", label: "Email", kind: "email", required: true },
    { name: "address", label: "Physical address (if customers visit)" },
    { name: "businessHours", label: "Business hours" },
    { name: "website", label: "Current website (if any)" },
    { name: "socialLinks", label: "Social media links", kind: "textarea" },
  ] },
  { number: "02", title: "Your story", subtitle: "What you do.", fields: [
    { name: "businessDescription", label: "Describe your business in a couple of sentences — what do you offer, and to whom?", kind: "textarea" },
    { name: "idealCustomer", label: "Who is your ideal customer?", kind: "textarea" },
    { name: "differentiators", label: "What makes you different from competitors?", kind: "textarea" },
  ] },
  { number: "03", title: "Goals", subtitle: "What the website should do.", fields: [
    { name: "goals", label: "Check all that apply", kind: "checkbox", options: goalOptions },
    { name: "otherGoal", label: "Other website goal" },
    { name: "successVision", label: "What does success look like six months after launch?", kind: "textarea" },
  ] },
  { number: "04", title: "Branding", subtitle: "Your look.", fields: [
    { name: "logo", label: "Do you have a logo?", kind: "radio", options: logoOptions },
    { name: "brandStyle", label: "Brand colors or fonts (if established)", kind: "textarea" },
    { name: "inspiration", label: "Websites or brands you admire — and what you like about them", kind: "textarea" },
  ] },
  { number: "05", title: "Content", subtitle: "Words & pictures.", fields: [
    { name: "textContent", label: "Text (services, menu, about, etc.)", kind: "radio", options: textOptions },
    { name: "photos", label: "Photos", kind: "radio", options: photoOptions },
    { name: "testimonials", label: "Customer reviews or testimonials we can feature?", kind: "textarea" },
  ] },
  { number: "06", title: "Features", subtitle: "What the site needs.", fields: [
    { name: "features", label: "Check all that apply", kind: "checkbox", options: featureOptions },
    { name: "otherFeature", label: "Other feature" },
  ] },
  { number: "07", title: "Access", subtitle: "Keys we'll need.",
    note: "We'll never ask for passwords over email. We'll set up secure access together during kickoff.",
    fields: [
      { name: "domain", label: "Domain name & where it's registered (GoDaddy, Namecheap, etc.)" },
      { name: "hosting", label: "Current hosting (if any)" },
      { name: "googleBusiness", label: "Google Business Profile — do you have one? Who manages it?", kind: "textarea" },
    ],
  },
  { number: "08", title: "Anything else", subtitle: "The floor is yours.", fields: [
    { name: "additionalNotes", label: "Deadlines, budget notes, worries, wild ideas — anything we should know", kind: "textarea" },
  ] },
];

/** One complete, labeled record shared by storage, email, and Discord. */
export function formatIntake(data: IntakeData): string {
  return ["LANDON & CO. — NEW CLIENT INTAKE", ...intakeSections.map(section =>
    `${section.number} · ${section.title.toUpperCase()}\n${section.subtitle}\n\n` +
    section.fields.map(field => {
      const value = data[field.name];
      const answer = Array.isArray(value) ? value.join("\n") : value;
      return `${field.label}\n${answer || "Not provided"}`;
    }).join("\n\n"),
  )].join("\n\n----------------------------------------\n\n");
}