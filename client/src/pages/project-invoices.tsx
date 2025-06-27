import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Receipt, Download, DollarSign, Calendar, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectLayout from "./project-layout";

export default function ProjectInvoices() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white font-mono">Loading invoices...</div>
        </div>
      </ProjectLayout>
    );
  }

  // Sample invoices (replace with real data when available)
  const sampleInvoices = [
    {
      id: 1,
      number: "INV-001",
      amount: 2500,
      status: "paid",
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Initial project setup and design phase"
    },
    {
      id: 2,
      number: "INV-002",
      amount: 3500,
      status: "pending",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Development phase milestone payment"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-white text-black';
      case 'pending': return 'bg-black text-white border-white';
      case 'overdue': return 'bg-white text-black';
      default: return 'bg-black text-white border-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-5 h-5 text-white" />;
      case 'pending': return <Clock className="w-5 h-5 text-white" />;
      case 'overdue': return <Clock className="w-5 h-5 text-white" />;
      default: return <Clock className="w-5 h-5 text-white" />;
    }
  };

  const totalAmount = sampleInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = sampleInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">Invoices</h1>
          <p className="text-white font-mono">Track payments and billing for your project</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black border-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-mono text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    ${totalAmount.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-mono text-sm">Paid Amount</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    ${paidAmount.toLocaleString()}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-mono text-sm">Outstanding</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    ${(totalAmount - paidAmount).toLocaleString()}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {sampleInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black border-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(invoice.status)}
                      <div>
                        <CardTitle className="text-white font-mono">{invoice.number}</CardTitle>
                        <p className="text-white font-mono text-sm mt-1">
                          {invoice.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white font-mono">
                          ${invoice.amount.toLocaleString()}
                        </div>
                        <div className="text-white font-mono text-sm">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={`font-mono ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-white font-mono text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                      {invoice.paidDate && (
                        <div className="flex items-center text-white font-mono text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Paid: {new Date(invoice.paidDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black border-white text-white hover:bg-white hover:text-black font-mono"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {sampleInvoices.length === 0 && (
          <Card className="bg-black border-white text-center py-12">
            <CardContent className="pt-6">
              <Receipt className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-xl font-mono font-bold mb-2 text-white">No Invoices Yet</h3>
              <p className="text-white font-mono">
                Invoices will appear here once billing begins.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProjectLayout>
  );
}