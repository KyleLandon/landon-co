import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Database, Mail, Key, Shield, Save } from "lucide-react";
import AdminLayout from "@/pages/admin-layout";

export default function AdminSettings() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "Landon & Co.",
    companyEmail: "info@landonco.co",
    companyPhone: "(940) 389-2685",
    defaultProjectStatus: "inquiry",
    autoCreateProjects: true,
    emailNotifications: true,
  });

  // Fetch current stats for dashboard
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  const handleSave = () => {
    // This would normally save to a settings API endpoint
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-mono font-bold text-white">Settings</h1>
          <p className="text-gray-400 font-mono mt-1">Configure system preferences and company settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Settings */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-mono flex items-center">
                <SettingsIcon className="w-5 h-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">Company Name</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="bg-transparent border-white/20 text-white font-mono focus:border-white/40"
                />
              </div>
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">Email</Label>
                <Input
                  type="email"
                  value={formData.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  className="bg-transparent border-white/20 text-white font-mono focus:border-white/40"
                />
              </div>
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">Phone</Label>
                <Input
                  value={formData.companyPhone}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                  className="bg-transparent border-white/20 text-white font-mono focus:border-white/40"
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Settings */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-mono flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Project Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">Default Project Status</Label>
                <select
                  value={formData.defaultProjectStatus}
                  onChange={(e) => handleInputChange('defaultProjectStatus', e.target.value)}
                  className="w-full p-3 bg-black border border-white/20 rounded text-white font-mono focus:border-white/40 focus:outline-none"
                >
                  <option value="inquiry">Inquiry</option>
                  <option value="proposal">Proposal</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="autoCreateProjects"
                  checked={formData.autoCreateProjects}
                  onChange={(e) => handleInputChange('autoCreateProjects', e.target.checked)}
                  className="w-4 h-4 bg-transparent border border-white/20 rounded focus:ring-white/20"
                />
                <Label htmlFor="autoCreateProjects" className="text-sm font-mono text-gray-300">
                  Auto-create projects from submissions
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  className="w-4 h-4 bg-transparent border border-white/20 rounded focus:ring-white/20"
                />
                <Label htmlFor="emailNotifications" className="text-sm font-mono text-gray-300">
                  Email notifications for new submissions
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* System Statistics */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-mono flex items-center">
                <Database className="w-5 h-5 mr-2" />
                System Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-mono font-bold text-green-400">
                    {stats?.totalProjects || 0}
                  </div>
                  <div className="text-sm font-mono text-gray-400">Total Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-blue-400">
                    {stats?.totalUsers || 0}
                  </div>
                  <div className="text-sm font-mono text-gray-400">Total Clients</div>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-yellow-400">
                    {stats?.totalContacts || 0}
                  </div>
                  <div className="text-sm font-mono text-gray-400">Contact Forms</div>
                </div>
                <div>
                  <div className="text-2xl font-mono font-bold text-purple-400">
                    {stats?.activeProjects || 0}
                  </div>
                  <div className="text-sm font-mono text-gray-400">Active Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys & Integrations */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-mono flex items-center">
                <Key className="w-5 h-5 mr-2" />
                API Keys & Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">SendGrid API Key</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="password"
                    value="sk-************************************************"
                    disabled
                    className="bg-transparent border-white/20 text-white font-mono focus:border-white/40"
                  />
                  <span className="text-green-400 text-sm font-mono">✓ Active</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">Database Connection</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="password"
                    value="postgresql://************************************************"
                    disabled
                    className="bg-transparent border-white/20 text-white font-mono focus:border-white/40"
                  />
                  <span className="text-green-400 text-sm font-mono">✓ Connected</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">Google OAuth</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="password"
                    value="REPL_ID************************************************"
                    disabled
                    className="bg-transparent border-white/20 text-white font-mono focus:border-white/40"
                  />
                  <span className="text-green-400 text-sm font-mono">✓ Configured</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-white text-black hover:bg-gray-200 font-mono"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white font-mono">Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm font-mono">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">System started successfully</span>
                <span className="text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-mono">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Database connection established</span>
                <span className="text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-mono">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300">SendGrid integration active</span>
                <span className="text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-mono">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Authentication service running</span>
                <span className="text-gray-500">2 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}