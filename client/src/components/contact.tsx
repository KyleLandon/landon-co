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

import { insertContactSchema, insertProjectSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { Mail, Phone, MessageCircle, ExternalLink, Instagram, Twitter, Briefcase, Users, DollarSign, Clock } from "lucide-react";

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
            id="project-submission"
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
              <form className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-mono text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-mono text-sm mb-2">Full Name *</label>
                      <Input 
                        placeholder="Your full name" 
                        className="bg-zinc-800 border-gray-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-mono text-sm mb-2">Email Address *</label>
                      <Input 
                        type="email"
                        placeholder="your@email.com" 
                        className="bg-zinc-800 border-gray-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-mono text-sm mb-2">Phone Number</label>
                      <Input 
                        placeholder="(555) 123-4567" 
                        className="bg-zinc-800 border-gray-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-mono text-sm mb-2">Company Name</label>
                      <Input 
                        placeholder="Your company (optional)" 
                        className="bg-zinc-800 border-gray-700 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-mono text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Project Details
                  </h4>
                  <div>
                    <label className="block text-white font-mono text-sm mb-2">Project Title *</label>
                    <Input 
                      placeholder="e.g., E-commerce Website for Fashion Brand" 
                      className="bg-zinc-800 border-gray-700 text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-mono text-sm mb-2">Project Type *</label>
                      <Select>
                        <SelectTrigger className="bg-zinc-800 border-gray-700 text-white font-mono">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-gray-700">
                          <SelectItem value="website" className="font-mono text-white hover:text-black">Website Development</SelectItem>
                          <SelectItem value="ecommerce" className="font-mono text-white hover:text-black">E-commerce Store</SelectItem>
                          <SelectItem value="webapp" className="font-mono text-white hover:text-black">Web Application</SelectItem>
                          <SelectItem value="branding" className="font-mono text-white hover:text-black">Brand Identity & Design</SelectItem>
                          <SelectItem value="automation" className="font-mono text-white hover:text-black">Business Automation</SelectItem>
                          <SelectItem value="other" className="font-mono text-white hover:text-black">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-white font-mono text-sm mb-2 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Budget Range *
                      </label>
                      <Select>
                        <SelectTrigger className="bg-zinc-800 border-gray-700 text-white font-mono">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-gray-700">
                          <SelectItem value="under-5k" className="font-mono text-white hover:text-black">Under $5K</SelectItem>
                          <SelectItem value="5k-10k" className="font-mono text-white hover:text-black">$5K - $10K</SelectItem>
                          <SelectItem value="10k-25k" className="font-mono text-white hover:text-black">$10K - $25K</SelectItem>
                          <SelectItem value="25k-50k" className="font-mono text-white hover:text-black">$25K - $50K</SelectItem>
                          <SelectItem value="50k-100k" className="font-mono text-white hover:text-black">$50K - $100K</SelectItem>
                          <SelectItem value="100k+" className="font-mono text-white hover:text-black">$100K+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-white font-mono text-sm mb-2 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Timeline *
                      </label>
                      <Select>
                        <SelectTrigger className="bg-zinc-800 border-gray-700 text-white font-mono">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
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
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-mono text-sm mb-2">Project Description *</label>
                    <Textarea 
                      placeholder="Describe your project in detail. What are your goals, target audience, specific features needed, etc."
                      className="bg-zinc-800 border-gray-700 text-white font-mono min-h-[120px]"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-gray-200 font-mono text-lg py-6"
                >
                  Submit Project & Create Account
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Methods Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20"
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

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-8">Follow Our Journey</p>
            <div className="flex justify-center space-x-8">
              {[
                { icon: Instagram, href: "https://instagram.com/landonandco", label: "@landonandco" },
                { icon: Twitter, href: "https://x.com/landonandco", label: "@landonandco" },
                { icon: Briefcase, href: "https://indeed.com/cmp/landon-and-co", label: "Indeed" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="group flex flex-col items-center space-y-2"
                >
                  <div className="w-12 h-12 bg-zinc-800 border border-zinc-600 rounded-full flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                    <social.icon className="w-6 h-6 text-white group-hover:text-black transition-colors duration-300" />
                  </div>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors duration-300">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="work-together" className="relative overflow-hidden bg-zinc-900 py-20">
        <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <div className="mb-8">
            <img
              src={whiteLogo}
              alt="Landon & Co. Logo"
              className="w-60 h-auto mx-auto opacity-80"
            />
          </div>
          <h2
            className="mb-4 text-4xl font-bold tracking-wider sm:text-5xl font-mono uppercase"
            style={{
              textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
              filter: "contrast(1.3)",
            }}
          >
            LET'S WORK
          </h2>
          <p className="text-gray-400 font-mono tracking-wide uppercase text-sm">
            Ready to create something raw and authentic? Let's build your digital presence with an edge.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-md"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono uppercase tracking-wider text-sm">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        className="bg-black border-2 border-white/30 rounded-none font-mono"
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
                    <FormLabel className="font-mono uppercase tracking-wider text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your@email.com"
                        {...field}
                        className="bg-black border-2 border-white/30 rounded-none font-mono"
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
                    <FormLabel className="font-mono uppercase tracking-wider text-sm">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(555) 123-4567"
                        {...field}
                        value={field.value || ""}
                        className="bg-black border-2 border-white/30 rounded-none font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono uppercase tracking-wider text-sm">Preferred Contact Method</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value || ""}
                        className="w-full bg-black border-2 border-white/30 rounded-none font-mono p-2 text-white"
                      >
                        <option value="">How should we reach you?</option>
                        <option value="email">Email</option>
                        <option value="text">Text Message</option>
                        <option value="call">Phone Call</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono uppercase tracking-wider text-sm">Budget Range</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value || ""}
                        className="w-full bg-black border-2 border-white/30 rounded-none font-mono p-2 text-white"
                      >
                        <option value="">Select budget range</option>
                        <option value="1k-5k">$1K - $5K</option>
                        <option value="5k-10k">$5K - $10K</option>
                        <option value="10k-25k">$10K - $25K</option>
                        <option value="25k+">$25K+</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono uppercase tracking-wider text-sm">Project Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me about your project vision..."
                        className="min-h-[120px] bg-black border-2 border-white/30 rounded-none font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-white text-black hover:bg-gray-200 font-mono uppercase tracking-wider border-2 border-white rounded-none transition-all duration-300"
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </motion.div>
        

      </div>
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={i} x1={i * 3.33} y1="0" x2={i * 3.33} y2="100" stroke="white" strokeWidth="0.2" />
          ))}
        </svg>
      </div>
      </section>
    </>
  );
};

export default Contact;