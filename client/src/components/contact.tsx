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
    <section id="contact" className="relative overflow-hidden bg-zinc-900 py-20">
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
          <div className="mt-8 p-6 bg-black/50 border border-white/20 rounded-none">
            <p className="text-white font-mono text-lg mb-4 text-center uppercase tracking-wider">
              CONTACT INFO
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-mono text-sm uppercase tracking-wider">Email:</span>
                <a 
                  href="mailto:info@landonco.co" 
                  className="text-white font-mono hover:text-gray-300 transition-colors duration-300"
                >
                  info@landonco.co
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-mono text-sm uppercase tracking-wider">Phone:</span>
                <a 
                  href="tel:+19403892685" 
                  className="text-white font-mono hover:text-gray-300 transition-colors duration-300"
                >
                  (940) 389-2685
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-mono text-sm uppercase tracking-wider">Discord:</span>
                <span className="text-white font-mono">kylelandon</span>
              </div>
            </div>
          </div>
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
  );
};

export default Contact;