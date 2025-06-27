import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { Briefcase, Users, Clock, DollarSign } from "lucide-react";

// Schema for project submission form
const projectSubmissionSchema = z.object({
  // Contact/Account info
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  
  // Project details
  projectTitle: z.string().min(5, "Project title must be at least 5 characters"),
  projectType: z.string().min(1, "Please select a project type"),
  description: z.string().min(20, "Please provide more details about your project"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  
  // Additional info
  companyName: z.string().optional(),
  website: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type ProjectSubmissionForm = z.infer<typeof projectSubmissionSchema>;

const ProjectSubmissionForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProjectSubmissionForm>({
    resolver: zodResolver(projectSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectTitle: "",
      projectType: "",
      description: "",
      budget: "",
      timeline: "",
      companyName: "",
      website: "",
      additionalNotes: "",
    },
  });

  const submitProjectMutation = useMutation({
    mutationFn: async (data: ProjectSubmissionForm) => {
      return await apiRequest("/api/project-submissions", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Project submitted successfully!",
        description: "We'll review your project details and get back to you within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/project-submissions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectSubmissionForm) => {
    submitProjectMutation.mutate(data);
  };

  const projectTypes = [
    "Website Development",
    "E-commerce Store",
    "Web Application",
    "Brand Identity & Design",
    "Digital Marketing Campaign",
    "Business Automation",
    "Mobile App Development",
    "Custom Software Solution",
    "Other"
  ];

  const budgetRanges = [
    "Under $5K",
    "$5K - $10K",
    "$10K - $25K",
    "$25K - $50K",
    "$50K - $100K",
    "$100K+"
  ];

  const timelines = [
    "ASAP (Rush)",
    "1-2 weeks",
    "1 month",
    "2-3 months",
    "3-6 months",
    "6+ months",
    "Flexible"
  ];

  return (
    <section id="project-submission" className="py-20 bg-black relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-zinc-900 border-gray-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white font-mono text-2xl flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Project Submission
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                Fill out the form below to submit your project. We'll create your account and get started right away.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-mono text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-mono">Full Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                className="bg-zinc-800 border-gray-700 text-white font-mono"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-mono">Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="your@email.com" 
                                className="bg-zinc-800 border-gray-700 text-white font-mono"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-mono">Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(555) 123-4567" 
                                className="bg-zinc-800 border-gray-700 text-white font-mono"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-mono">Company Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your company (optional)" 
                                className="bg-zinc-800 border-gray-700 text-white font-mono"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-mono text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Project Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="projectTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-mono">Project Title *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., E-commerce Website for Fashion Brand" 
                                className="bg-zinc-800 border-gray-700 text-white font-mono"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="projectType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-mono">Project Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-zinc-800 border-gray-700 text-white font-mono">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-zinc-900 border-gray-700">
                                  {projectTypes.map((type) => (
                                    <SelectItem key={type} value={type} className="font-mono text-white hover:text-black">
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-mono flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                Budget Range *
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-zinc-800 border-gray-700 text-white font-mono">
                                    <SelectValue placeholder="Select budget" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-zinc-900 border-gray-700">
                                  {budgetRanges.map((budget) => (
                                    <SelectItem key={budget} value={budget} className="font-mono text-white hover:text-black">
                                      {budget}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="timeline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-mono flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Timeline *
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-zinc-800 border-gray-700 text-white font-mono">
                                    <SelectValue placeholder="Select timeline" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-zinc-900 border-gray-700">
                                  {timelines.map((timeline) => (
                                    <SelectItem key={timeline} value={timeline} className="font-mono text-white hover:text-black">
                                      {timeline}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-mono">Project Description *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your project in detail. What are your goals, target audience, specific features needed, etc."
                                className="bg-zinc-800 border-gray-700 text-white font-mono min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-mono">Current Website (if any)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://yourwebsite.com" 
                                className="bg-zinc-800 border-gray-700 text-white font-mono"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-mono">Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any additional information, questions, or special requirements..."
                                className="bg-zinc-800 border-gray-700 text-white font-mono"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={submitProjectMutation.isPending}
                    className="w-full bg-white text-black hover:bg-gray-200 font-mono text-lg py-6"
                  >
                    {submitProjectMutation.isPending ? "Submitting Project..." : "Submit Project & Create Account"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectSubmissionForm;