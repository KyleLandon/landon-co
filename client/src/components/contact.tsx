import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Mail, Phone, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { intakeSchema, intakeSections, type IntakeData } from "@shared/intake";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const emptyIntake: IntakeData = {
  businessName: "", name: "", phone: "", email: "", address: "",
  businessHours: "", website: "", socialLinks: "", businessDescription: "",
  idealCustomer: "", differentiators: "", goals: [], otherGoal: "",
  successVision: "", logo: "", brandStyle: "", inspiration: "",
  textContent: "", photos: "", testimonials: "", features: [],
  otherFeature: "", domain: "", hosting: "", googleBusiness: "",
  additionalNotes: "", faxNumber: "",
};

const Contact = () => {
  const formStarted = useRef(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const form = useForm<IntakeData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: emptyIntake,
  });

  useEffect(() => {
    // Discard legacy account-gated drafts. Never submit them automatically.
    try { sessionStorage.removeItem("pendingProjectSubmission"); } catch {}
    // The form mounts after the initial HTML, so honor direct intake links here.
    if (window.location.hash === "#contact") {
      const frame = requestAnimationFrame(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "instant" });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  useEffect(() => {
    if (receipt) receiptRef.current?.focus();
  }, [receipt]);

  const submission = useMutation({
    mutationFn: async (data: IntakeData): Promise<{ message?: string }> => {
      const response = await apiRequest("POST", "/api/project-submissions", data);
      return await response.json();
    },
    onSuccess: (response) => {
      trackEvent("project_submission_succeeded", { location: "contact_form" });
      setReceipt(
        response.message ||
        "Your intake has been received. We'll review your ideas and follow up by email.",
      );
      form.reset(emptyIntake);
    },
    onError: () => {
      trackEvent("project_submission_failed", { location: "contact_form" });
    },
  });

  const startForm = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    trackEvent("project_form_started", { location: "contact_form" });
  };

  const inputClass =
    "bg-[var(--bg-elevated)] border-[var(--border-color)] text-white placeholder:text-white/30 focus:border-white/30 focus-visible:ring-white/30 rounded-lg";

  return (
    <section id="contact" className="relative section-padding bg-black scroll-mt-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-5 lg:sticky lg:top-28 self-start"
          >
            <p className="eyebrow mb-4">Start a project</p>
            <h2 className="heading-xl text-white mb-5">
              Let&rsquo;s build something <span className="text-gradient">together.</span>
            </h2>
            <p className="body-md mb-5">
              Tell us about your business, your customers, and what you have in
              mind. You don&rsquo;t need all the answers to get started.
            </p>
            <p className="text-sm text-white/65 mb-10 leading-relaxed">
              No account or sign-in needed. Only your name and email are required.
              Skip anything you&rsquo;re not sure about &mdash; we can work it out together.
            </p>
            <div className="space-y-3">
              {[
                { href: "mailto:info@landonco.co", label: "Email", text: "info@landonco.co", Icon: Mail },
                { href: "tel:+13616215151", label: "Phone", text: "361-621-5151", Icon: Phone },
              ].map(({ href, label, text, Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-4 p-4 surface-card hover-lift group transition-colors hover:bg-white hover:border-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-black/5 group-hover:border-black/20">
                      <Icon className="w-4 h-4 text-white group-hover:text-black" />
                    </div>
                    <div>
                      <p className="eyebrow mb-1 !text-white group-hover:!text-black/60">{label}</p>
                      <p className="text-white text-sm font-medium group-hover:text-black">{text}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-black" />
                </a>
              ))}
            </div>
          </motion.div>

          <div id="project-form" className="lg:col-span-7 min-w-0">
            {receipt ? (
              <div
                ref={receiptRef}
                tabIndex={-1}
                role="status"
                className="surface-card p-6 md:p-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <CheckCircle2 className="w-9 h-9 text-white mb-6" aria-hidden="true" />
                <p className="eyebrow mb-3">Intake received</p>
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-4">
                  Thanks for telling us your story.
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">{receipt}</p>
                <p className="text-sm text-white/60 mb-8">
                  Nothing else to set up. We&rsquo;ll continue the conversation by email.
                </p>
                <Button
                  type="button"
                  className="btn-primary rounded-full"
                  onClick={() => {
                    formStarted.current = false;
                    setReceipt(null);
                    submission.reset();
                  }}
                >
                  Send another intake <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <form
                noValidate
                onChangeCapture={startForm}
                onSubmit={(event) => {
                  event.preventDefault();
                  if (submission.isPending) return;
                  startForm();
                  trackEvent("project_submission_attempted", { location: "contact_form" });
                  void form.handleSubmit(
                    (data) => submission.mutate(data),
                    () => trackEvent("project_submission_failed", { location: "contact_form", reason: "validation" }),
                  )(event);
                }}
                className="surface-card p-6 md:p-8 space-y-10"
                aria-busy={submission.isPending}
              >
                <div className="border-b border-[var(--border-color)] pb-6">
                  <p className="eyebrow mb-3">Client intake</p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Eight small sections, one good starting point. Fields marked
                    <span className="text-white"> required </span>are the only ones you need to fill in.
                  </p>
                </div>
                <div hidden aria-hidden="true">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    {...form.register("faxNumber")}
                  />
                </div>
                <fieldset disabled={submission.isPending} className="space-y-10 min-w-0">
                  <legend className="sr-only">Tell us about your website</legend>
                  {intakeSections.map((section) => (
                    <section key={section.number} aria-labelledby={`intake-section-${section.number}`}>
                      <div className="flex gap-4 items-start mb-6">
                        <span className="text-xs font-mono text-white/50 border border-[var(--border-color)] rounded-full w-9 h-9 shrink-0 flex items-center justify-center">
                          {section.number}
                        </span>
                        <div>
                          <h3 id={`intake-section-${section.number}`} className="text-lg font-medium text-white">
                            {section.title}
                          </h3>
                          <p className="text-sm text-white/55 mt-1">{section.subtitle}</p>
                        </div>
                      </div>
                      {section.note && (
                        <p className="flex gap-3 p-4 mb-5 rounded-lg bg-white/5 text-sm text-white/70 leading-relaxed">
                          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                          {section.note}
                        </p>
                      )}
                      <div className={`grid grid-cols-1 gap-5 ${section.number === "01" ? "md:grid-cols-2" : ""}`}>
                        {section.fields.map((field) => {
                          const id = `intake-${field.name}`;
                          const error = form.formState.errors[field.name];
                          const errorId = `${id}-error`;
                          if (field.kind === "checkbox" || field.kind === "radio") {
                            return (
                              <fieldset key={field.name} className="min-w-0">
                                <legend className="text-sm text-white/80 mb-3">{field.label}</legend>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {field.options?.map((option, index) => (
                                    <label
                                      key={option}
                                      htmlFor={`${id}-${index}`}
                                      className="flex gap-3 items-start p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] text-sm text-white/80 cursor-pointer hover:border-white/30 has-[:checked]:border-white/50 has-[:checked]:bg-white/5"
                                    >
                                      <input
                                        id={`${id}-${index}`}
                                        type={field.kind}
                                        value={option}
                                        {...form.register(field.name)}
                                        className="mt-0.5 shrink-0 accent-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        aria-invalid={!!error}
                                        aria-describedby={error ? errorId : undefined}
                                      />
                                      <span>{option}</span>
                                    </label>
                                  ))}
                                </div>
                                {field.kind === "radio" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      form.setValue(field.name, "", { shouldDirty: true, shouldValidate: true });
                                      startForm();
                                    }}
                                    className="text-xs text-white/60 hover:text-white underline underline-offset-4 mt-3 focus-visible:outline focus-visible:outline-white"
                                    aria-label={`Clear answer: ${field.label}`}
                                  >
                                    Clear / skip this question
                                  </button>
                                )}
                                {error && <p id={errorId} className="text-sm text-red-300 mt-2">{error.message}</p>}
                              </fieldset>
                            );
                          }
                          const sharedProps = {
                            id,
                            ...form.register(field.name),
                            "aria-invalid": !!error,
                            "aria-describedby": error ? errorId : undefined,
                            required: !!field.required,
                          };
                          return (
                            <div key={field.name} className={field.kind === "textarea" ? "md:col-span-full" : ""}>
                              <label htmlFor={id} className="block text-sm text-white/80 mb-2 leading-relaxed">
                                {field.label}
                                {field.required && <span className="text-xs text-white/50 ml-2">required</span>}
                              </label>
                              {field.kind === "textarea" ? (
                                <Textarea {...sharedProps} className={`${inputClass} min-h-[100px]`} maxLength={3000} />
                              ) : (
                                <Input
                                  {...sharedProps}
                                  type={field.kind || "text"}
                                  className={inputClass}
                                  maxLength={field.name === "name" ? 200 : field.name === "email" ? 254 : 500}
                                  autoComplete={field.name === "email" ? "email" : field.name === "phone" ? "tel" : undefined}
                                />
                              )}
                              {error && <p id={errorId} className="text-sm text-red-300 mt-2">{error.message}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </fieldset>
                <div className="border-t border-[var(--border-color)] pt-6 space-y-4">
                  {submission.isError && (
                    <div role="alert" className="rounded-lg border border-red-300/30 bg-red-300/5 p-4 text-sm text-red-200 leading-relaxed">
                      We couldn&rsquo;t send your intake. Your answers are still here.
                      Please try again below, or email{" "}
                      <a className="underline underline-offset-4" href="mailto:info@landonco.co">info@landonco.co</a>.
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="btn-primary w-full justify-center text-sm py-6 rounded-full"
                    disabled={submission.isPending}
                  >
                    {submission.isPending ? "Sending your intake…" : submission.isError ? "Try sending again" : "Send your intake"}
                    {!submission.isPending && <ArrowRight className="w-4 h-4" />}
                  </Button>
                  <p className="text-xs text-white/50 text-center leading-relaxed">
                    Straight to our team. No account, no password, no extra steps.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
