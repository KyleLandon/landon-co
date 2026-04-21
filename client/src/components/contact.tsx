import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertProjectSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const projectSubmissionFormSchema = insertProjectSubmissionSchema;
type ProjectSubmissionForm = z.infer<typeof projectSubmissionFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const projectForm = useForm<ProjectSubmissionForm>({
    resolver: zodResolver(projectSubmissionFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      projectTitle: "",
      projectType: "",
      budget: "",
      timeline: "",
      description: "",
      website: "",
      additionalNotes: "",
    },
  });

  const projectMutation = useMutation({
    mutationFn: async (data: ProjectSubmissionForm) => {
      return await apiRequest("POST", "/api/project-submissions", data);
    },
    onSuccess: (response: any) => {
      if (isAuthenticated && response.project) {
        toast({
          title: "Project created",
          description:
            "Your project is being tracked. Redirecting to your dashboard…",
        });
        projectForm.reset();
        queryClient.invalidateQueries({ queryKey: ["/api/my-projects"] });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1800);
      } else {
        toast({
          title: "Project submitted",
          description:
            "We'll review your submission and reach out within 24 hours.",
        });
        projectForm.reset();
        queryClient.invalidateQueries({ queryKey: ["/api/project-submissions"] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again or email us directly.",
        variant: "destructive",
      });
    },
  });

  const onProjectSubmit = (data: ProjectSubmissionForm) => {
    if (!isAuthenticated) {
      sessionStorage.setItem(
        "pendingProjectSubmission",
        JSON.stringify(data)
      );
      toast({
        title: "Account required",
        description: "Creating your account first, then submitting your project…",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
    projectMutation.mutate(data);
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const pending = sessionStorage.getItem("pendingProjectSubmission");
      if (pending) {
        try {
          const data = JSON.parse(pending);
          sessionStorage.removeItem("pendingProjectSubmission");
          projectForm.reset(data);
          toast({
            title: "Account created",
            description: "Now submitting your project…",
          });
          setTimeout(() => projectMutation.mutate(data), 1500);
        } catch {
          sessionStorage.removeItem("pendingProjectSubmission");
        }
      }
    }
  }, [isAuthenticated, authLoading, projectForm, projectMutation, toast]);

  const inputClass =
    "bg-[var(--bg-elevated)] border-[var(--border-color)] text-white placeholder:text-white/30 focus:border-white/30 rounded-lg";

  return (
    <section id="contact" className="relative section-padding bg-black">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: pitch + contact methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 lg:sticky lg:top-28 self-start"
          >
            <p className="eyebrow mb-4">Start a project</p>
            <h2 className="heading-xl text-white mb-5">
              Let&rsquo;s build something <span className="text-gradient">together.</span>
            </h2>
            <p className="body-md mb-10">
              Tell us a bit about your business and what you have in mind.
              We&rsquo;ll review your submission and get back to you within
              24 hours.
            </p>

            <div className="space-y-3">
              <a
                href="mailto:info@landonco.co"
                className="flex items-center justify-between gap-4 p-4 surface-card hover-lift group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="eyebrow mb-1">Email</p>
                    <p className="text-white text-sm font-medium">
                      info@landonco.co
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </a>
              <a
                href="tel:+19403892685"
                className="flex items-center justify-between gap-4 p-4 surface-card hover-lift group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="eyebrow mb-1">Phone</p>
                    <p className="text-white text-sm font-medium">
                      (940) 389-2685
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            id="project-form"
            className="lg:col-span-7"
          >
            <div className="surface-card p-6 md:p-8">
              <Form {...projectForm}>
                <form
                  onSubmit={projectForm.handleSubmit(onProjectSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={projectForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80 text-sm">
                            Full name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={projectForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80 text-sm">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className={inputClass}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={projectForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-sm">
                          Current website (optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://yourwebsite.com"
                            className={inputClass}
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="projectTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-sm">
                          Project title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Marketing site for fashion brand"
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={projectForm.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80 text-sm">
                            Project type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[var(--bg-elevated)] border-[var(--border-color)]">
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="webapp">Web app</SelectItem>
                              <SelectItem value="branding">Branding</SelectItem>
                              <SelectItem value="automation">Automation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={projectForm.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80 text-sm">
                            Budget
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[var(--bg-elevated)] border-[var(--border-color)]">
                              <SelectItem value="less-than-500">Under $500</SelectItem>
                              <SelectItem value="1000">$1,000</SelectItem>
                              <SelectItem value="2500">$2,500</SelectItem>
                              <SelectItem value="5000">$5,000</SelectItem>
                              <SelectItem value="greater-than-10000">$10,000+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={projectForm.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80 text-sm">
                            Timeline
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[var(--bg-elevated)] border-[var(--border-color)]">
                              <SelectItem value="asap">ASAP</SelectItem>
                              <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                              <SelectItem value="1month">1 month</SelectItem>
                              <SelectItem value="2-3months">2-3 months</SelectItem>
                              <SelectItem value="3-6months">3-6 months</SelectItem>
                              <SelectItem value="6months+">6+ months</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={projectForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-sm">
                          Project description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Goals, audience, must-have features…"
                            className={`${inputClass} min-h-[140px]`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="btn-primary w-full justify-center text-sm py-6 rounded-full"
                    disabled={projectMutation.isPending}
                  >
                    {projectMutation.isPending
                      ? "Submitting…"
                      : "Submit project"}
                    {!projectMutation.isPending && (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
