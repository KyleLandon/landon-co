import { useState, useRef } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar, DollarSign, CheckCircle, PenTool, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { Project, Contract } from "@shared/schema";

export default function ClientProjectContracts() {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [signingContract, setSigningContract] = useState<Contract | null>(null);
  const [signature, setSignature] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: contracts = [], isLoading: contractsLoading } = useQuery<Contract[]>({
    queryKey: [`/api/projects/${id}/contracts`],
    enabled: !!id,
  });

  const signContractMutation = useMutation({
    mutationFn: async ({ contractId, signature }: { contractId: number; signature: string }) => {
      const res = await apiRequest("POST", `/api/contracts/${contractId}/sign`, { signature });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/contracts`] });
      setSigningContract(null);
      setSignature("");
      clearCanvas();
      toast({
        title: "Success",
        description: "Contract signed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sign contract",
        variant: "destructive",
      });
    },
  });

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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert canvas to base64 string
    const signatureData = canvas.toDataURL();
    setSignature(signatureData);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  const handleSignContract = () => {
    if (!signingContract || !signature) {
      toast({
        title: "Error",
        description: "Please provide your signature before signing",
        variant: "destructive",
      });
      return;
    }

    signContractMutation.mutate({
      contractId: signingContract.id,
      signature,
    });
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
        <h1 className="text-3xl font-bold text-white">Contracts</h1>
        <p className="text-white/60 mt-2">
          View and sign contracts for project: {project.title}
        </p>
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
            <h3 className="text-xl text-white mb-2">No Contracts Available</h3>
            <p className="text-white/60">
              Contracts will appear here when your project manager sends them
            </p>
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
                  <Badge className={`${getStatusColor(contract.status)} text-white`}>
                    {contract.status?.toUpperCase()}
                  </Badge>
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

                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {contract.content?.substring(0, 500)}
                    {contract.content && contract.content.length > 500 && "..."}
                  </p>
                </div>

                {contract.terms && (
                  <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <h4 className="text-white text-sm font-bold mb-2">Terms & Conditions:</h4>
                    <p className="text-gray-300 text-xs whitespace-pre-wrap">
                      {contract.terms}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  
                  {contract.status === "sent" && contract.signedBy !== user?.id && (
                    <Dialog open={signingContract?.id === contract.id} onOpenChange={() => setSigningContract(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSigningContract(contract)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <PenTool className="w-4 h-4 mr-2" />
                          Sign Contract
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Sign Contract: {contract.title}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="bg-gray-800 p-4 rounded-lg max-h-60 overflow-y-auto">
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">
                              {contract.content}
                            </p>
                          </div>

                          {contract.terms && (
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <h4 className="text-white text-sm font-bold mb-2">Terms & Conditions:</h4>
                              <p className="text-gray-300 text-xs whitespace-pre-wrap">
                                {contract.terms}
                              </p>
                            </div>
                          )}

                          <div>
                            <label className="text-white text-sm block mb-2">
                              Digital Signature (Draw your signature below):
                            </label>
                            <div className="border border-gray-600 rounded-lg p-4 bg-white">
                              <canvas
                                ref={canvasRef}
                                width={600}
                                height={200}
                                className="border border-gray-300 rounded cursor-crosshair"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                              />
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={clearCanvas}
                                className="bg-transparent border-gray-600 text-white/60 hover:bg-gray-800"
                              >
                                Clear Signature
                              </Button>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                            <p className="text-yellow-800 text-sm">
                              <strong>Legal Notice:</strong> By signing this contract digitally, you agree to all terms and conditions outlined above. 
                              This digital signature has the same legal validity as a handwritten signature.
                            </p>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              onClick={handleSignContract}
                              disabled={signContractMutation.isPending || !signature}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              {signContractMutation.isPending ? "Signing..." : "Sign Contract"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setSigningContract(null);
                                clearCanvas();
                                setSignature("");
                              }}
                              className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {contract.status === "signed" && contract.signedBy === user?.id && (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Signed by You
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