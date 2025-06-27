import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Download, DollarSign, Calendar, FileText, CreditCard } from "lucide-react";
import ProjectLayout from "./project-layout";
import type { Project } from "@shared/schema";

// Mock invoice data structure for now
interface Invoice {
  id: number;
  number: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: Date;
  issueDate: Date;
  description: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

export default function ProjectInvoices() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Loading invoices...</div>
        </div>
      </ProjectLayout>
    );
  }

  // Mock invoices for demonstration
  const invoices: Invoice[] = [
    {
      id: 1,
      number: "INV-2024-001",
      amount: 2500,
      status: "paid",
      dueDate: new Date("2024-12-15"),
      issueDate: new Date("2024-11-15"),
      description: "Initial project setup and wireframes",
      items: [
        { description: "Project Planning & Strategy", quantity: 1, rate: 800, amount: 800 },
        { description: "Wireframe Design", quantity: 1, rate: 600, amount: 600 },
        { description: "Initial Development Setup", quantity: 1, rate: 1100, amount: 1100 }
      ]
    },
    {
      id: 2,
      number: "INV-2024-002",
      amount: 3500,
      status: "pending",
      dueDate: new Date("2025-01-15"),
      issueDate: new Date("2024-12-15"),
      description: "Frontend development and design implementation",
      items: [
        { description: "Frontend Development", quantity: 1, rate: 2000, amount: 2000 },
        { description: "UI/UX Implementation", quantity: 1, rate: 1500, amount: 1500 }
      ]
    }
  ];

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-900 text-green-300";
      case "pending": return "bg-yellow-900 text-yellow-300";
      case "overdue": return "bg-red-900 text-red-300";
      default: return "bg-gray-900 text-gray-300";
    }
  };

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono">Project Invoices</h1>
            <p className="text-gray-400 font-mono mt-2">Billing and payment information</p>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white font-mono">${totalAmount.toLocaleString()}</p>
                  <p className="text-gray-400 font-mono text-sm">Total Project Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white font-mono">${paidAmount.toLocaleString()}</p>
                  <p className="text-gray-400 font-mono text-sm">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Receipt className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white font-mono">${pendingAmount.toLocaleString()}</p>
                  <p className="text-gray-400 font-mono text-sm">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-purple-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white font-mono">{invoices.length}</p>
                  <p className="text-gray-400 font-mono text-sm">Invoices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Invoice History
            </CardTitle>
            <CardDescription className="text-gray-400 font-mono">
              All invoices for this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-mono font-semibold text-lg">{invoice.number}</h3>
                      <p className="text-gray-400 font-mono text-sm mt-1">{invoice.description}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <Badge className={`font-mono ${getStatusColor(invoice.status)}`}>
                          {invoice.status.toUpperCase()}
                        </Badge>
                        <span className="text-gray-500 font-mono text-xs flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Due: {invoice.dueDate.toLocaleDateString()}
                        </span>
                        <span className="text-gray-500 font-mono text-xs">
                          Issued: {invoice.issueDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white font-mono">${invoice.amount.toLocaleString()}</p>
                      <Button variant="outline" size="sm" className="mt-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 font-mono">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-gray-300 font-mono font-semibold mb-3">Invoice Items</h4>
                    <div className="space-y-2">
                      {invoice.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm font-mono">
                          <span className="text-gray-400">{item.description}</span>
                          <span className="text-white">${item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {invoices.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-mono">No invoices yet</p>
                <p className="text-gray-500 font-mono text-sm mt-2">
                  Invoices will appear here as the project progresses
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-mono font-semibold mb-3">Payment Methods</h4>
                <div className="space-y-2 text-sm font-mono text-gray-400">
                  <p>• Bank Transfer (ACH)</p>
                  <p>• Wire Transfer</p>
                  <p>• Check (upon request)</p>
                  <p>• Online Payment Portal</p>
                </div>
              </div>
              <div>
                <h4 className="text-white font-mono font-semibold mb-3">Payment Terms</h4>
                <div className="space-y-2 text-sm font-mono text-gray-400">
                  <p>• Net 30 days from invoice date</p>
                  <p>• Late fees apply after 30 days</p>
                  <p>• Payment confirmation via email</p>
                  <p>• Contact for payment questions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
}