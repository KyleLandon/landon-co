import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { insertContactSchema, insertProjectSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { Mail, Phone, MessageCircle, ExternalLink, Briefcase, Users, DollarSign, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Use the existing project submission schema
const projectSubmissionFormSchema = insertProjectSubmissionSchema;
import whiteLogo from "@assets/super_white_transparent_1750910829574.png";

const formSchema = insertContactSchema.extend({
  budget: insertContactSchema.shape.project.optional(),
});

type ContactForm = z.infer<typeof formSchema>;
type ProjectSubmissionForm = z.infer<typeof projectSubmissionFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const form = useForm<ContactForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredContact: "",
      message: "",
      budget: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return await apiRequest("/api/contact", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. We'll get back to you soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    const submissionData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      preferredContact: data.preferredContact,
      project: data.budget || "",
      message: data.message,
    };
    contactMutation.mutate(submissionData);
  };

  // Project submission form setup
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
      return await apiRequest("/api/project-submissions", "POST", data);
    },
    onSuccess: (response: any) => {
      if (isAuthenticated && response.project) {
        // User was authenticated - project was created
        toast({
          title: "Project Created Successfully!",
          description: "Your project is now being tracked. Redirecting to your dashboard...",
          variant: "default",
        });
        
        projectForm.reset();
        queryClient.invalidateQueries({ queryKey: ["/api/my-projects"] });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        // User was not authenticated - submission stored for review
        toast({
          title: "Project Submitted Successfully!",
          description: "We'll review your submission and be in touch within 24 hours.",
          variant: "default",
        });
        projectForm.reset();
        queryClient.invalidateQueries({ queryKey: ["/api/project-submissions"] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onProjectSubmit = (data: ProjectSubmissionForm) => {
    // Check if user is authenticated before submitting
    if (!isAuthenticated) {
      // Store form data in sessionStorage to restore after login
      sessionStorage.setItem('pendingProjectSubmission', JSON.stringify(data));
      
      toast({
        title: "Account Required",
        description: "Creating your account first, then we'll submit your project...",
        variant: "default",
      });
      
      // Redirect to login with Google OAuth
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
    
    // User is authenticated, submit project directly
    projectMutation.mutate(data);
  };

  // Check for pending project submission after authentication
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const pendingSubmission = sessionStorage.getItem('pendingProjectSubmission');
      if (pendingSubmission) {
        try {
          const data = JSON.parse(pendingSubmission);
          sessionStorage.removeItem('pendingProjectSubmission');
          
          // Fill the form with the stored data
          projectForm.reset(data);
          
          toast({
            title: "Account Created Successfully!",
            description: "Now submitting your project...",
            variant: "default",
          });
          
          // Submit the project automatically
          setTimeout(() => {
            projectMutation.mutate(data);
          }, 1500);
          
        } catch (error) {
          console.error('Error processing pending submission:', error);
          sessionStorage.removeItem('pendingProjectSubmission');
        }
      }
    }
  }, [isAuthenticated, authLoading, projectForm, projectMutation]);

  return (
    <>
      {/* Hero Contact Section */}
      <section id="contact" className="relative min-h-screen bg-black overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + i * 8}%`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 min-h-screen flex flex-col justify-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-mono font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                LET'S
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent">
                BUILD
              </span>
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto max-w-md mb-8"
            />
            <p className="text-xl md:text-2xl font-mono text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Transform your vision into digital reality. 
              <span className="text-white"> Let's create something extraordinary together.</span>
            </p>
          </motion.div>

          {/* Project Submission Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-20"
            id="project-form"
          >
            <div className="bg-zinc-900 border border-gray-800 shadow-2xl rounded-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-white font-mono text-2xl flex items-center justify-center gap-2 mb-4">
                  <Briefcase className="w-6 h-6" />
                  Project Submission
                </h3>
                <p className="text-gray-400 font-mono">
                  Fill out the form below to submit your project. We'll create your account and get started right away.
                </p>
              </div>
              
              {/* Project Submission Form */}
              <Form {...projectForm}>
                <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-mono text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={projectForm.control}
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
                      control={projectForm.control}
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
                      control={projectForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-mono">Current Website (if any)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://yourwebsite.com" 
                              className="bg-zinc-800 border-gray-700 text-white font-mono"
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
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-mono text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Project Details
                  </h4>
                  <FormField
                    control={projectForm.control}
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
                      control={projectForm.control}
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
                              <SelectItem value="website" className="font-mono text-white hover:text-black">Website Development</SelectItem>
                              <SelectItem value="ecommerce" className="font-mono text-white hover:text-black">E-commerce Store</SelectItem>
                              <SelectItem value="webapp" className="font-mono text-white hover:text-black">Web Application</SelectItem>
                              <SelectItem value="branding" className="font-mono text-white hover:text-black">Brand Identity & Design</SelectItem>
                              <SelectItem value="automation" className="font-mono text-white hover:text-black">Business Automation</SelectItem>
                              <SelectItem value="other" className="font-mono text-white hover:text-black">Other</SelectItem>
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
                              <SelectItem value="less-than-500" className="font-mono text-white hover:text-black">Less than $500</SelectItem>
                              <SelectItem value="1000" className="font-mono text-white hover:text-black">$1,000</SelectItem>
                              <SelectItem value="2500" className="font-mono text-white hover:text-black">$2,500</SelectItem>
                              <SelectItem value="5000" className="font-mono text-white hover:text-black">$5,000</SelectItem>
                              <SelectItem value="greater-than-10000" className="font-mono text-white hover:text-black">Greater than $10,000</SelectItem>
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
                              <SelectItem value="asap" className="font-mono text-white hover:text-black">ASAP (Rush)</SelectItem>
                              <SelectItem value="1-2weeks" className="font-mono text-white hover:text-black">1-2 weeks</SelectItem>
                              <SelectItem value="1month" className="font-mono text-white hover:text-black">1 month</SelectItem>
                              <SelectItem value="2-3months" className="font-mono text-white hover:text-black">2-3 months</SelectItem>
                              <SelectItem value="3-6months" className="font-mono text-white hover:text-black">3-6 months</SelectItem>
                              <SelectItem value="6months+" className="font-mono text-white hover:text-black">6+ months</SelectItem>
                              <SelectItem value="flexible" className="font-mono text-white hover:text-black">Flexible</SelectItem>
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
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-gray-200 font-mono text-lg py-6"
                  disabled={projectMutation.isPending}
                >
                  {projectMutation.isPending ? "Submitting..." : "Submit Project & Create Account"}
                </Button>
              </form>
              </Form>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Contact Methods Grid with Full Width Pinstripes */}
      <section className="relative w-full border-t border-zinc-800">
        {/* Pinstripe Background */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length:50 }).map((_, i) => (
              <line key={i} x1={i * 2} y1="0" x2={i * 2} y2="100" stroke="white" strokeWidth="0.2" />
            ))}
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto py-16"
          >
            {/* Primary Contact - Email */}
            <motion.a
              href="mailto:info@landonco.co"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group relative bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 p-8 hover:border-white/50 transition-all duration-500 transform perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Primary</span>
                  </div>
                </div>
                <h3 className="text-2xl font-mono font-bold text-white mb-2">Email</h3>
                <p className="text-gray-400 font-mono text-lg mb-4">info@landonco.co</p>
                <div className="flex items-center text-gray-500 group-hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="font-mono text-sm uppercase tracking-wider">Send Message</span>
                </div>
              </div>
            </motion.a>

            {/* Phone */}
            <motion.a
              href="tel:+19403892685"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group relative bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 p-8 hover:border-white/50 transition-all duration-500 transform perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Direct</span>
                  </div>
                </div>
                <h3 className="text-2xl font-mono font-bold text-white mb-2">Phone</h3>
                <p className="text-gray-400 font-mono text-lg mb-4">(940) 389-2685</p>
                <div className="flex items-center text-gray-500 group-hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="font-mono text-sm uppercase tracking-wider">Call Now</span>
                </div>
              </div>
            </motion.a>

            {/* Discord */}
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group relative bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 p-8 hover:border-white/50 transition-all duration-500 transform perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Chat</span>
                  </div>
                </div>
                <h3 className="text-2xl font-mono font-bold text-white mb-2">Discord</h3>
                <p className="text-gray-400 font-mono text-lg mb-4">kylelandon</p>
                <div className="flex items-center text-gray-500 group-hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span className="font-mono text-sm uppercase tracking-wider">Start Chat</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </>
  );
};

export default Contact;