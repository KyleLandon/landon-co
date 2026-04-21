import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileText, Calendar, DollarSign, CheckCircle, Clock, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "../admin-layout";
import type { Project, Contract, User as UserType } from "@shared/schema";

export default function AdminProjectContracts() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: client } = useQuery<UserType>({
    queryKey: [`/api/users/${project?.clientId}`],
    enabled: !!project?.clientId,
  });

  const { data: contracts = [], isLoading: contractsLoading } = useQuery<Contract[]>({
    queryKey: [`/api/projects/${id}/contracts`],
    enabled: !!id,
  });

  const createContractMutation = useMutation({
    mutationFn: async (contractData: any) => {
      const res = await apiRequest("POST", `/api/projects/${id}/contracts`, contractData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/contracts`] });
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Contract created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create contract",
        variant: "destructive",
      });
    },
  });

  const updateContractMutation = useMutation({
    mutationFn: async ({ contractId, updates }: { contractId: number; updates: any }) => {
      const res = await apiRequest("PATCH", `/api/contracts/${contractId}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/contracts`] });
      setEditingContract(null);
      toast({
        title: "Success",
        description: "Contract updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update contract",
        variant: "destructive",
      });
    },
  });

  const deleteContractMutation = useMutation({
    mutationFn: async (contractId: number) => {
      const res = await apiRequest("DELETE", `/api/contracts/${contractId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/contracts`] });
      toast({
        title: "Success",
        description: "Contract deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contract",
        variant: "destructive",
      });
    },
  });

  const handleCreateContract = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createContractMutation.mutate({
      title: formData.get("title"),
      description: formData.get("description"),
      content: formData.get("content"),
      terms: formData.get("terms"),
      totalAmount: formData.get("totalAmount"),
    });
  };

  const handleUpdateContract = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingContract) return;
    
    const formData = new FormData(e.currentTarget);
    
    updateContractMutation.mutate({
      contractId: editingContract.id,
      updates: {
        title: formData.get("title"),
        description: formData.get("description"),
        content: formData.get("content"),
        terms: formData.get("terms"),
        totalAmount: formData.get("totalAmount"),
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed": return "bg-green-500";
      case "sent": return "bg-blue-500";
      case "draft": return "bg-gray-500";
      case "completed": return "bg-purple-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (projectLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Loading project...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Project not found</div>
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
            <h1 className="text-3xl font-bold text-white">Contract Management</h1>
            <p className="text-white/60 mt-2">
              Project: {project.title} | Client: {client?.firstName || "Unknown"} {client?.lastName || ""}
            </p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Contract</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateContract} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Contract Title</Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Web Development Service Agreement"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalAmount" className="text-white">Total Amount</Label>
                    <Input
                      id="totalAmount"
                      name="totalAmount"
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="$5,000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Brief description of the contract"
                  />
                </div>
                <div>
                  <Label htmlFor="content" className="text-white">Contract Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    rows={8}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter the full contract content here..."
                  />
                </div>
                <div>
                  <Label htmlFor="terms" className="text-white">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    name="terms"
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Additional terms and conditions..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createContractMutation.isPending}
                    className="flex-1 bg-white text-black hover:bg-gray-200"
                  >
                    {createContractMutation.isPending ? "Creating..." : "Create Contract"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contracts List */}
        {contractsLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-white/60">Loading contracts...</div>
          </div>
        ) : contracts.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No Contracts Yet</h3>
              <p className="text-white/60 mb-4">Create your first contract for this project</p>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Contract
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {contracts.map((contract) => (
              <Card key={contract.id} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-xl">{contract.title}</CardTitle>
                      {contract.description && (
                        <CardDescription className="text-white/60 mt-2">
                          {contract.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(contract.status)} text-white`}>
                        {contract.status?.toUpperCase()}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingContract(contract)}
                          className="bg-transparent border-gray-600 text-white/60 hover:bg-gray-800"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteContractMutation.mutate(contract.id)}
                          className="bg-transparent border-red-600 text-red-400 hover:bg-red-900"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {contract.totalAmount && (
                      <div className="flex items-center text-green-400 text-sm">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {contract.totalAmount}
                      </div>
                    )}
                    <div className="flex items-center text-blue-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : "Unknown"}
                    </div>
                    {contract.signedAt && (
                      <div className="flex items-center text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Signed {new Date(contract.signedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">
                      {contract.content?.substring(0, 300)}
                      {contract.content && contract.content.length > 300 && "..."}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Full Contract
                    </Button>
                    {contract.status === "draft" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-gray-600 text-white/60 hover:bg-gray-800"
                      >
                        Send to Client
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Contract Dialog */}
        {editingContract && (
          <Dialog open={!!editingContract} onOpenChange={() => setEditingContract(null)}>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Contract</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateContract} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title" className="text-white">Contract Title</Label>
                    <Input
                      id="edit-title"
                      name="title"
                      defaultValue={editingContract.title}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-totalAmount" className="text-white">Total Amount</Label>
                    <Input
                      id="edit-totalAmount"
                      name="totalAmount"
                      defaultValue={editingContract.totalAmount || ""}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description" className="text-white">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingContract.description || ""}
                    rows={3}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-content" className="text-white">Contract Content</Label>
                  <Textarea
                    id="edit-content"
                    name="content"
                    defaultValue={editingContract.content}
                    rows={8}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-terms" className="text-white">Terms & Conditions</Label>
                  <Textarea
                    id="edit-terms"
                    name="terms"
                    defaultValue={editingContract.terms || ""}
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={updateContractMutation.isPending}
                    className="flex-1 bg-white text-black hover:bg-gray-200"
                  >
                    {updateContractMutation.isPending ? "Updating..." : "Update Contract"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingContract(null)}
                    className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}