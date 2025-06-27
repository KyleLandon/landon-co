import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="bg-gray-900 border-gray-700 w-80">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-mono text-lg">Need Help?</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Get in touch with Kyle for support or questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="mailto:info@landonco.co"
                  className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-white font-mono text-sm group-hover:text-blue-400">Email Support</p>
                    <p className="text-gray-400 text-xs">info@landonco.co</p>
                  </div>
                </a>
                
                <a
                  href="tel:+19403892685"
                  className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <Phone className="w-5 h-5 text-green-400 mr-3" />
                  <div>
                    <p className="text-white font-mono text-sm group-hover:text-green-400">Call Direct</p>
                    <p className="text-gray-400 text-xs">(940) 389-2685</p>
                  </div>
                </a>
                
                <button
                  onClick={() => window.location.href = "/#work-together"}
                  className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group w-full text-left"
                >
                  <MessageSquare className="w-5 h-5 text-purple-400 mr-3" />
                  <div>
                    <p className="text-white font-mono text-sm group-hover:text-purple-400">Contact Form</p>
                    <p className="text-gray-400 text-xs">Send a detailed message</p>
                  </div>
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}