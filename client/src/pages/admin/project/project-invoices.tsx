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
import { Plus, Receipt, Calendar, DollarSign, CheckCircle, Clock, Edit, Trash2, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "../admin-layout";
import type { Project, Invoice, User as UserType } from "@shared/schema";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function AdminProjectInvoices() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 }
  ]);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: client } = useQuery<UserType>({
    queryKey: [`/api/users/${project?.clientId}`],
    enabled: !!project?.clientId,
  });

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: [`/api/projects/${id}/invoices`],
    enabled: !!id,
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      const res = await apiRequest("POST", `/api/projects/${id}/invoices`, invoiceData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/invoices`] });
      setIsCreating(false);
      setInvoiceItems([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: async ({ invoiceId, updates }: { invoiceId: number; updates: any }) => {
      const res = await apiRequest("PATCH", `/api/invoices/${invoiceId}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/invoices`] });
      setEditingInvoice(null);
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update invoice",
        variant: "destructive",
      });
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: number) => {
      const res = await apiRequest("DELETE", `/api/invoices/${invoiceId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/invoices`] });
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate amount for this item
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setInvoiceItems(newItems);
  };

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = 0; // Can be made configurable
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    return { subtotal, taxRate, taxAmount, total };
  };

  const handleCreateInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { subtotal, taxRate, taxAmount, total } = calculateTotals();
    
    createInvoiceMutation.mutate({
      title: formData.get("title"),
      description: formData.get("description"),
      items: invoiceItems,
      subtotal: subtotal.toFixed(2),
      taxRate: taxRate.toString(),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: total.toFixed(2),
      dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500";
      case "sent": return "bg-blue-500";
      case "draft": return "bg-gray-500";
      case "overdue": return "bg-red-500";
      case "cancelled": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  if (projectLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Loading project...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Project not found</div>
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
            <h1 className="text-3xl font-bold text-white font-mono">Invoice Management</h1>
            <p className="text-gray-400 font-mono mt-2">
              Project: {project.title} | Client: {client?.firstName || "Unknown"} {client?.lastName || ""}
            </p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white font-mono">Create New Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateInvoice} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-white font-mono">Invoice Title</Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      className="bg-gray-800 border-gray-700 text-white font-mono"
                      placeholder="Web Development Services - January 2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate" className="text-white font-mono">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      className="bg-gray-800 border-gray-700 text-white font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-white font-mono">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={2}
                    className="bg-gray-800 border-gray-700 text-white font-mono"
                    placeholder="Invoice description"
                  />
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-white font-mono text-lg">Invoice Items</Label>
                    <Button
                      type="button"
                      onClick={addInvoiceItem}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white font-mono"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {invoiceItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-gray-800 rounded-lg">
                        <div className="col-span-5">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white font-mono"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white font-mono"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) => updateInvoiceItem(index, 'rate', parseFloat(e.target.value) || 0)}
                            className="bg-gray-700 border-gray-600 text-white font-mono"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={`$${item.amount.toFixed(2)}`}
                            readOnly
                            className="bg-gray-600 border-gray-600 text-gray-300 font-mono"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            onClick={() => removeInvoiceItem(index)}
                            size="sm"
                            variant="outline"
                            className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                    <div className="space-y-2 text-right">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-mono">Subtotal:</span>
                        <span className="text-white font-mono">${calculateTotals().subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-mono">Tax:</span>
                        <span className="text-white font-mono">${calculateTotals().taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-2">
                        <span className="text-white font-mono">Total:</span>
                        <span className="text-green-400 font-mono">${calculateTotals().total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createInvoiceMutation.isPending}
                    className="flex-1 bg-white text-black hover:bg-gray-200 font-mono"
                  >
                    {createInvoiceMutation.isPending ? "Creating..." : "Create Invoice"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="bg-transparent border-gray-700 text-white hover:bg-gray-800 font-mono"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Invoices List */}
        {invoicesLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400 font-mono">Loading invoices...</div>
          </div>
        ) : invoices.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-mono text-white mb-2">No Invoices Yet</h3>
              <p className="text-gray-400 font-mono mb-4">Create your first invoice for this project</p>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white font-mono text-xl">{invoice.title}</CardTitle>
                      <CardDescription className="text-gray-400 font-mono mt-1">
                        Invoice #{invoice.invoiceNumber}
                      </CardDescription>
                      {invoice.description && (
                        <CardDescription className="text-gray-400 font-mono mt-2">
                          {invoice.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(invoice.status)} text-white font-mono`}>
                        {invoice.status?.toUpperCase()}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingInvoice(invoice)}
                          className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800 font-mono"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
                          className="bg-transparent border-red-600 text-red-400 hover:bg-red-900 font-mono"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-green-400 font-mono text-lg font-bold">
                      <DollarSign className="w-5 h-5 mr-2" />
                      {invoice.totalAmount}
                    </div>
                    <div className="flex items-center text-blue-400 font-mono text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "Unknown"}
                    </div>
                    {invoice.dueDate && (
                      <div className="flex items-center text-orange-400 font-mono text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        Due {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    {invoice.paidAt && (
                      <div className="flex items-center text-green-400 font-mono text-sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Paid {new Date(invoice.paidAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
                    >
                      View Invoice
                    </Button>
                    {invoice.status === "draft" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800 font-mono"
                      >
                        Send to Client
                      </Button>
                    )}
                    {invoice.status === "sent" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white font-mono"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payment Link
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}