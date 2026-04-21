import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Receipt, Calendar, DollarSign, CheckCircle, CreditCard, Download, Clock } from "lucide-react";
import type { Project, Invoice } from "@shared/schema";

export default function ClientProjectInvoices() {
  const { id } = useParams();
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: [`/api/projects/${id}/invoices`],
    enabled: !!id,
  });

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

  const isOverdue = (invoice: Invoice) => {
    if (!invoice.dueDate || invoice.status === "paid") return false;
    return new Date(invoice.dueDate) < new Date();
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/60">Project not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Invoices</h1>
        <p className="text-white/60 mt-2">
          View and pay invoices for project: {project.title}
        </p>
      </div>

      {/* Invoice Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs">Total Invoices</p>
                <p className="text-white text-xl font-bold">{invoices.length}</p>
              </div>
              <Receipt className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs">Paid</p>
                <p className="text-green-400 text-xl font-bold">
                  {invoices.filter(inv => inv.status === "paid").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs">Pending</p>
                <p className="text-yellow-400 text-xl font-bold">
                  {invoices.filter(inv => inv.status === "sent").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs">Total Amount</p>
                <p className="text-white text-xl font-bold">
                  {formatCurrency(
                    invoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0).toString()
                  )}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      {invoicesLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-white/60">Loading invoices...</div>
        </div>
      ) : invoices.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-12 text-center">
            <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No Invoices Yet</h3>
            <p className="text-white/60">
              Invoices will appear here when your project manager sends them
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className={`bg-gray-900 border-gray-800 ${isOverdue(invoice) ? 'border-red-500' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-xl">{invoice.title}</CardTitle>
                    <CardDescription className="text-white/60 mt-1">
                      Invoice #{invoice.invoiceNumber}
                    </CardDescription>
                    {invoice.description && (
                      <CardDescription className="text-white/60 mt-2">
                        {invoice.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(invoice.status)} text-white`}>
                      {invoice.status?.toUpperCase()}
                    </Badge>
                    {isOverdue(invoice) && (
                      <Badge className="bg-red-500 text-white">
                        OVERDUE
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-green-400 text-lg font-bold">
                    <DollarSign className="w-5 h-5 mr-2" />
                    {formatCurrency(invoice.totalAmount)}
                  </div>
                  <div className="flex items-center text-blue-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "Unknown"}
                  </div>
                  {invoice.dueDate && (
                    <div className={`flex items-center text-sm ${isOverdue(invoice) ? 'text-red-400' : 'text-orange-400'}`}>
                      <Clock className="w-4 h-4 mr-2" />
                      Due {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  {invoice.paidAt && (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Paid {new Date(invoice.paidAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Invoice Items Preview */}
                {invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0 ? (
                  <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <h4 className="text-white text-sm font-bold mb-3">Invoice Items:</h4>
                    <div className="space-y-2">
                      {(invoice.items as any[]).slice(0, 3).map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">
                            {item.description} (Qty: {item.quantity})
                          </span>
                          <span className="text-white">
                            {formatCurrency((item.quantity * item.rate).toString())}
                          </span>
                        </div>
                      ))}
                      {(invoice.items as any[]).length > 3 && (
                        <p className="text-white/60 text-xs">
                          ... and {(invoice.items as any[]).length - 3} more items
                        </p>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-600 pt-3 mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Subtotal:</span>
                        <span className="text-white">{formatCurrency(invoice.subtotal || "0")}</span>
                      </div>
                      {parseFloat(invoice.taxAmount || "0") > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Tax:</span>
                          <span className="text-white">{formatCurrency(invoice.taxAmount || "0")}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-2 mt-2">
                        <span className="text-white">Total:</span>
                        <span className="text-green-400">{formatCurrency(invoice.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex gap-3">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  
                  {invoice.status === "sent" && (
                    <Dialog open={payingInvoice?.id === invoice.id} onOpenChange={() => setPayingInvoice(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setPayingInvoice(invoice)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Pay Invoice: {invoice.title}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-white text-lg">Invoice #{invoice.invoiceNumber}</h3>
                              <span className="text-green-400 text-xl font-bold">
                                {formatCurrency(invoice.totalAmount)}
                              </span>
                            </div>
                            {invoice.dueDate && (
                              <p className="text-white/60 text-sm">
                                Due: {new Date(invoice.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-white text-lg">Payment Options</h4>
                            
                            <div className="grid gap-3">
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <CreditCard className="w-6 h-6 mr-3" />
                                    <div className="text-left">
                                      <p className="font-bold">Pay with Credit Card</p>
                                      <p className="text-sm opacity-80">Secure payment via Stripe</p>
                                    </div>
                                  </div>
                                  <span className="text-sm">Instant</span>
                                </div>
                              </Button>

                              <Button 
                                variant="outline" 
                                className="bg-transparent border-gray-600 text-white hover:bg-gray-800 p-6 h-auto"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <DollarSign className="w-6 h-6 mr-3" />
                                    <div className="text-left">
                                      <p className="font-bold">Bank Transfer</p>
                                      <p className="text-sm opacity-80">Direct bank transfer</p>
                                    </div>
                                  </div>
                                  <span className="text-sm">1-3 days</span>
                                </div>
                              </Button>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <p className="text-blue-800 text-sm">
                              <strong>Secure Payment:</strong> All payments are processed securely. 
                              Your payment information is encrypted and protected.
                            </p>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setPayingInvoice(null)}
                              className="flex-1 bg-transparent border-gray-700 text-white hover:bg-gray-800"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {invoice.status === "paid" && (
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Paid
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}