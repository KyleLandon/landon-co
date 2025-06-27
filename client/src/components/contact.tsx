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
import { insertContactSchema } from "@shared/schema";
import type { z } from "zod";
import { Mail, Phone, MessageCircle, ExternalLink, Instagram, Twitter, Briefcase } from "lucide-react";
import whiteLogo from "@assets/super_white_transparent_1750910829574.png";

const formSchema = insertContactSchema.extend({
  budget: insertContactSchema.shape.project.optional(),
});

type ContactForm = z.infer<typeof formSchema>;

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
      {/* Contact Info Section */}
      <section id="contact" className="relative py-20 bg-gradient-to-b from-black via-zinc-900 to-zinc-800 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-4xl font-bold tracking-wider sm:text-5xl font-mono uppercase"
            style={{
              textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
              filter: "contrast(1.3)",
              color: "white",
            }}
          >
            CONTACT
          </motion.h2>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="text-center mb-12">
              <p className="text-gray-400 font-mono text-lg">Ready to start your project? Reach out using any method below</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Email Card */}
              <motion.a
                href="mailto:info@landonco.co"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-zinc-800/50 border-2 border-white/20 p-6 hover:border-white/40 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-mono text-sm uppercase tracking-wider mb-2">Email</h4>
                    <p className="text-gray-300 font-mono text-sm">info@landonco.co</p>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-white transition-colors duration-300">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="font-mono text-xs uppercase">Send Message</span>
                  </div>
                </div>
              </motion.a>

              {/* Phone Card */}
              <motion.a
                href="tel:+19403892685"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-zinc-800/50 border-2 border-white/20 p-6 hover:border-white/40 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-mono text-sm uppercase tracking-wider mb-2">Phone</h4>
                    <p className="text-gray-300 font-mono text-sm">(940) 389-2685</p>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-white transition-colors duration-300">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="font-mono text-xs uppercase">Call Now</span>
                  </div>
                </div>
              </motion.a>

              {/* Discord Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-zinc-800/50 border-2 border-white/20 p-6 hover:border-white/40 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-mono text-sm uppercase tracking-wider mb-2">Discord</h4>
                    <p className="text-gray-300 font-mono text-sm">kylelandon</p>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-white transition-colors duration-300">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span className="font-mono text-xs uppercase">Chat</span>
                  </div>
                </div>
              </motion.div>

              {/* Instagram Card */}
              <motion.a
                href="https://instagram.com/landonandco"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-zinc-800/50 border-2 border-white/20 p-6 hover:border-white/40 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-mono text-sm uppercase tracking-wider mb-2">Instagram</h4>
                    <p className="text-gray-300 font-mono text-sm">@landonandco</p>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-white transition-colors duration-300">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="font-mono text-xs uppercase">Follow</span>
                  </div>
                </div>
              </motion.a>

              {/* X (Twitter) Card */}
              <motion.a
                href="https://x.com/landonandco"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-zinc-800/50 border-2 border-white/20 p-6 hover:border-white/40 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Twitter className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-mono text-sm uppercase tracking-wider mb-2">X (Twitter)</h4>
                    <p className="text-gray-300 font-mono text-sm">@landonandco</p>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-white transition-colors duration-300">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="font-mono text-xs uppercase">Follow</span>
                  </div>
                </div>
              </motion.a>

              {/* Indeed Card */}
              <motion.a
                href="https://indeed.com/cmp/landon-and-co"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-zinc-800/50 border-2 border-white/20 p-6 hover:border-white/40 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-mono text-sm uppercase tracking-wider mb-2">Indeed</h4>
                    <p className="text-gray-300 font-mono text-sm">Company Profile</p>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover:text-white transition-colors duration-300">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="font-mono text-xs uppercase">View Jobs</span>
                  </div>
                </div>
              </motion.a>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-black border-2 border-white/30 rounded-none font-mono">
                          <SelectValue placeholder="How should we reach you?" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/30 rounded-none">
                          <SelectItem value="email" className="font-mono text-white hover:bg-white/10 focus:bg-white/10">Email</SelectItem>
                          <SelectItem value="text" className="font-mono text-white hover:bg-white/10 focus:bg-white/10">Text Message</SelectItem>
                          <SelectItem value="call" className="font-mono text-white hover:bg-white/10 focus:bg-white/10">Phone Call</SelectItem>
                        </SelectContent>
                      </Select>
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