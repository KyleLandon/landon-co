import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Download, 
  Trash2, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music,
  Archive,
  Eye,
  EyeOff,
  Plus,
  X,
  Folder
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ProjectFile } from "@shared/schema";

interface FileManagerProps {
  projectId: string;
  isAdmin: boolean;
}

const FILE_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "asset", label: "Assets" },
  { value: "deliverable", label: "Deliverables" },
  { value: "reference", label: "Reference" },
];

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (mimeType.startsWith('video/')) return <Video className="w-4 h-4" />;
  if (mimeType.startsWith('audio/')) return <Music className="w-4 h-4" />;
  if (mimeType.includes('pdf') || mimeType.includes('text')) return <FileText className="w-4 h-4" />;
  if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FileManager({ projectId, isAdmin }: FileManagerProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [uploadDescription, setUploadDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch project files
  const { data: files = [], isLoading } = useQuery<ProjectFile[]>({
    queryKey: [`/api/projects/${projectId}/files`],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Upload file mutation
  const uploadFile = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/files`] });
      setShowUpload(false);
      setUploadDescription("");
      setSelectedCategory("general");
      setIsPublic(false);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete file mutation
  const deleteFile = useMutation({
    mutationFn: async (fileId: number) => {
      return apiRequest(`/api/files/${fileId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/files`] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error", 
        description: "Failed to delete file",
        variant: "destructive",
      });
    },
  });

  // Toggle file visibility mutation (admin only)
  const toggleVisibility = useMutation({
    mutationFn: async ({ fileId, isPublic }: { fileId: number; isPublic: boolean }) => {
      return apiRequest(`/api/files/${fileId}/visibility`, "PATCH", { isPublic });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/files`] });
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory);
    formData.append('description', uploadDescription);
    formData.append('isPublic', isPublic.toString());
    
    uploadFile.mutate(formData);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    handleFileSelect(e.dataTransfer.files);
  };

  const groupedFiles = files.reduce((acc, file) => {
    const category = file.fileCategory || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(file);
    return acc;
  }, {} as Record<string, ProjectFile[]>);

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400 font-mono">Loading files...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white font-mono">Project Files</CardTitle>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Upload Form */}
          <AnimatePresence>
            {showUpload && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-gray-700 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-mono text-white">Upload New File</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUpload(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Drag and Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300 font-mono mb-2">
                    Drag and drop files here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Maximum file size: 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                </div>
                
                {/* Upload Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 font-mono">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FILE_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="rounded border-gray-600"
                      />
                      <Label htmlFor="isPublic" className="text-gray-300 font-mono">
                        Visible to client
                      </Label>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label className="text-gray-300 font-mono">Description (Optional)</Label>
                  <Textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Describe this file..."
                    className="bg-gray-800 border-gray-700 text-white font-mono"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* File List */}
          {Object.keys(groupedFiles).length === 0 ? (
            <div className="text-center py-8">
              <Folder className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 font-mono">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFiles).map(([category, categoryFiles]) => (
                <div key={category}>
                  <h3 className="text-lg font-mono text-white mb-3 capitalize flex items-center">
                    <Folder className="w-5 h-5 mr-2" />
                    {category} ({categoryFiles.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {categoryFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="text-blue-400">
                            {getFileIcon(file.mimeType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-mono text-white">{file.originalName}</h4>
                              {!file.isPublic && (
                                <Badge variant="secondary" className="text-xs">
                                  Private
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 font-mono">
                              {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                            {file.description && (
                              <p className="text-sm text-gray-500 mt-1">{file.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVisibility.mutate({ 
                                fileId: file.id, 
                                isPublic: !file.isPublic 
                              })}
                              className="text-gray-400 hover:text-white"
                            >
                              {file.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/api/files/${file.id}/download`, '_blank')}
                            className="text-gray-400 hover:text-white"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFile.mutate(file.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}