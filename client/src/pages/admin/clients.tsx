import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash2, Users, Mail, Phone, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "../admin-layout";

export default function AdminClients() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Fetch users
  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${userId}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingUser(null);
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setUserToDelete(null);
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users.filter((user: any) => 
    searchTerm === "" || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-mono">Loading clients...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-mono font-bold text-white">Clients</h1>
            <p className="text-gray-400 font-mono mt-1">Manage client accounts and information</p>
          </div>
          <div className="text-white font-mono">
            <span className="text-2xl font-bold">{users.length}</span>
            <span className="text-gray-400 ml-2">Total Clients</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search clients by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-transparent border-white/20 text-white font-mono focus:border-white/40"
          />
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user: any) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black font-mono text-lg font-bold">
                          {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-white font-mono text-lg">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.email?.split('@')[0] || 'Unknown'
                          }
                        </CardTitle>
                        <p className="text-gray-400 font-mono text-sm">ID: {user.id}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300 font-mono text-sm">
                      <Mail className="w-4 h-4 mr-2 text-blue-400" />
                      {user.email || 'No email'}
                    </div>
                    
                    {user.createdAt && (
                      <div className="flex items-center text-gray-300 font-mono text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-green-400" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent border-blue-500 text-blue-400 hover:bg-blue-500/10 font-mono text-xs"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-red-500 text-red-400 hover:bg-red-500/10 font-mono text-xs"
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-mono text-white mb-2">No Clients Found</h3>
            <p className="text-gray-400 font-mono">
              {searchTerm ? "Try adjusting your search terms" : "No clients have registered yet"}
            </p>
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="bg-black border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="font-mono text-xl">Edit Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateUserMutation.mutate({
                userId: editingUser.id,
                updates: {
                  email: formData.get("email"),
                  firstName: formData.get("firstName"),
                  lastName: formData.get("lastName"),
                }
              });
            }} className="space-y-4">
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">Email</Label>
                <Input
                  type="email"
                  name="email"
                  defaultValue={editingUser.email}
                  className="w-full p-3 bg-transparent border border-white/20 rounded text-white font-mono focus:border-white/40 focus:outline-none"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  defaultValue={editingUser.firstName || ''}
                  className="w-full p-3 bg-transparent border border-white/20 rounded text-white font-mono focus:border-white/40 focus:outline-none"
                />
              </div>
              <div>
                <Label className="text-sm font-mono text-gray-300 block mb-2">Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  defaultValue={editingUser.lastName || ''}
                  className="w-full p-3 bg-transparent border border-white/20 rounded text-white font-mono focus:border-white/40 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="flex-1 bg-white text-black hover:bg-gray-200 font-mono"
                >
                  {updateUserMutation.isPending ? "Updating..." : "Update Client"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 font-mono"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Confirmation Dialog */}
      {userToDelete && (
        <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <DialogContent className="bg-black border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="font-mono text-xl">Delete Client</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-300 font-mono mb-4">
                Are you sure you want to delete client "{userToDelete.email}"? This action cannot be undone and will remove all associated projects and data.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => deleteUserMutation.mutate(userToDelete.id)}
                  disabled={deleteUserMutation.isPending}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700 font-mono"
                >
                  {deleteUserMutation.isPending ? "Deleting..." : "Delete Client"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUserToDelete(null)}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 font-mono"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}