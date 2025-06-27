import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProjectRequestDialogProps {
  children: React.ReactNode;
}

export default function ProjectRequestDialog({ children }: ProjectRequestDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'details'>('intro');
  const [formData, setFormData] = useState({
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/project-request", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-projects"] });
      setIsOpen(false);
      setStep('intro');
      setFormData({ projectType: '', budget: '', timeline: '', description: '' });
      toast({
        title: "Project Request Sent",
        description: "Kyle will review your request and create your project soon!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send project request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({
      ...formData,
      message: `New project request:
      
Project Type: ${formData.projectType}
Budget: ${formData.budget}
Timeline: ${formData.timeline}

Description:
${formData.description}

Please create a project for me and let me know the next steps!`
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-black border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl flex items-center text-white">
            <MessageCircle className="w-5 h-5 mr-2 text-white" />
            Start New Project
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-mono">
            {step === 'intro' 
              ? "Kyle will help you get started with your project" 
              : "Tell us about your project"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'intro' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="bg-zinc-900 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-mono text-sm font-bold">K</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-sm text-gray-400 mb-2">Kyle from Landon & Co.</p>
                      <p className="text-white text-sm leading-relaxed font-mono">
                        Hey! I'm excited to work with you. To get started, I'll need some details about your project. 
                        This helps me understand your needs and create the perfect solution for you.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep('details')}
                  className="bg-white hover:bg-gray-200 text-black font-mono"
                >
                  Let's Get Started
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="projectType" className="font-mono text-white">Project Type</Label>
                <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                  <SelectTrigger className="bg-zinc-900 border-gray-700 text-white font-mono">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-gray-700 text-white">
                    <SelectItem value="website" className="font-mono">Website Development</SelectItem>
                    <SelectItem value="ecommerce" className="font-mono">E-commerce Store</SelectItem>
                    <SelectItem value="webapp" className="font-mono">Web Application</SelectItem>
                    <SelectItem value="branding" className="font-mono">Branding & Design</SelectItem>
                    <SelectItem value="optimization" className="font-mono">Business Optimization</SelectItem>
                    <SelectItem value="other" className="font-mono">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget" className="font-mono text-white">Budget Range</Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger className="bg-zinc-900 border-gray-700 text-white font-mono">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-gray-700 text-white">
                    <SelectItem value="under-5k" className="font-mono">Under $5,000</SelectItem>
                    <SelectItem value="5k-10k" className="font-mono">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10k-25k" className="font-mono">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25k-50k" className="font-mono">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k+" className="font-mono">$50,000+</SelectItem>
                    <SelectItem value="discuss" className="font-mono">Let's Discuss</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline" className="font-mono text-white">Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                  <SelectTrigger className="bg-zinc-900 border-gray-700 text-white font-mono">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-gray-700 text-white">
                    <SelectItem value="asap" className="font-mono">ASAP</SelectItem>
                    <SelectItem value="1-month" className="font-mono">Within 1 month</SelectItem>
                    <SelectItem value="2-3-months" className="font-mono">2-3 months</SelectItem>
                    <SelectItem value="flexible" className="font-mono">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="font-mono text-white">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell us about your project, goals, and any specific requirements..."
                  className="bg-zinc-900 border-gray-700 text-white min-h-[100px] font-mono placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="flex justify-between">
                <Button 
                  type="button"
                  onClick={() => setStep('intro')}
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-zinc-800 font-mono"
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  disabled={createProjectMutation.isPending || !formData.projectType || !formData.description}
                  className="bg-white text-black hover:bg-gray-200 font-mono"
                >
                  {createProjectMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Request
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}