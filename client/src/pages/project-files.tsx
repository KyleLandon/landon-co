import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Folder, 
  File, 
  Download, 
  Upload, 
  Image, 
  FileText, 
  Code, 
  Archive,
  Video,
  Music,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import ProjectLayout from "./project-layout";
import type { Project } from "@shared/schema";

// Mock file data structure
interface ProjectFile {
  id: number;
  name: string;
  type: "folder" | "file";
  size?: number;
  mimeType?: string;
  uploadDate: Date;
  uploadedBy: string;
  category: "design" | "development" | "documentation" | "assets" | "deliverables";
  url?: string;
}

export default function ProjectFiles() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 font-mono">Loading files...</div>
        </div>
      </ProjectLayout>
    );
  }

  // Mock files for demonstration
  const files: ProjectFile[] = [
    {
      id: 1,
      name: "Project Wireframes",
      type: "folder",
      uploadDate: new Date("2024-11-15"),
      uploadedBy: "Landon & Co.",
      category: "design"
    },
    {
      id: 2,
      name: "initial-wireframes.fig",
      type: "file",
      size: 2500000,
      mimeType: "application/figma",
      uploadDate: new Date("2024-11-15"),
      uploadedBy: "Landon & Co.",
      category: "design",
      url: "#"
    },
    {
      id: 3,
      name: "brand-guidelines.pdf",
      type: "file",
      size: 1200000,
      mimeType: "application/pdf",
      uploadDate: new Date("2024-11-20"),
      uploadedBy: "Landon & Co.",
      category: "design",
      url: "#"
    },
    {
      id: 4,
      name: "project-requirements.docx",
      type: "file",
      size: 85000,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      uploadDate: new Date("2024-12-01"),
      uploadedBy: "Client",
      category: "documentation",
      url: "#"
    },
    {
      id: 5,
      name: "Source Code",
      type: "folder",
      uploadDate: new Date("2024-12-10"),
      uploadedBy: "Landon & Co.",
      category: "development"
    },
    {
      id: 6,
      name: "logo-assets.zip",
      type: "file",
      size: 5600000,
      mimeType: "application/zip",
      uploadDate: new Date("2024-12-15"),
      uploadedBy: "Landon & Co.",
      category: "assets",
      url: "#"
    }
  ];

  const getFileIcon = (file: ProjectFile) => {
    if (file.type === "folder") return Folder;
    
    if (file.mimeType?.startsWith("image/")) return Image;
    if (file.mimeType?.startsWith("video/")) return Video;
    if (file.mimeType?.startsWith("audio/")) return Music;
    if (file.mimeType?.includes("pdf") || file.mimeType?.includes("document")) return FileText;
    if (file.mimeType?.includes("zip") || file.mimeType?.includes("archive")) return Archive;
    if (file.name.includes(".js") || file.name.includes(".ts") || file.name.includes(".css")) return Code;
    
    return File;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "design": return "bg-purple-900 text-purple-300";
      case "development": return "bg-blue-900 text-blue-300";
      case "documentation": return "bg-green-900 text-green-300";
      case "assets": return "bg-yellow-900 text-yellow-300";
      case "deliverables": return "bg-red-900 text-red-300";
      default: return "bg-gray-900 text-gray-300";
    }
  };

  const totalSize = files.filter(f => f.size).reduce((sum, f) => sum + (f.size || 0), 0);
  const fileCount = files.filter(f => f.type === "file").length;
  const folderCount = files.filter(f => f.type === "folder").length;

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono">Project Files</h1>
            <p className="text-gray-400 font-mono mt-2">Shared documents, assets, and deliverables</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>

        {/* File Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <File className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white font-mono">{fileCount}</p>
                  <p className="text-gray-400 font-mono text-sm">Files</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Folder className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white font-mono">{folderCount}</p>
                  <p className="text-gray-400 font-mono text-sm">Folders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Archive className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white font-mono">{formatFileSize(totalSize)}</p>
                  <p className="text-gray-400 font-mono text-sm">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Upload className="w-8 h-8 text-purple-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white font-mono">12</p>
                  <p className="text-gray-400 font-mono text-sm">Uploads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search files..." 
                  className="pl-10 bg-gray-800 border-gray-700 text-white font-mono"
                />
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 font-mono cursor-pointer hover:bg-gray-700">All</Badge>
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 font-mono cursor-pointer hover:bg-gray-700">Design</Badge>
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 font-mono cursor-pointer hover:bg-gray-700">Development</Badge>
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 font-mono cursor-pointer hover:bg-gray-700">Docs</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <Folder className="w-5 h-5 mr-2" />
              File Explorer
            </CardTitle>
            <CardDescription className="text-gray-400 font-mono">
              Browse and download project files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file) => {
                const Icon = getFileIcon(file);
                return (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-750 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Icon className={`w-6 h-6 ${file.type === "folder" ? "text-yellow-400" : "text-blue-400"}`} />
                      <div>
                        <h3 className="text-white font-mono font-semibold">{file.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge className={`text-xs font-mono ${getCategoryColor(file.category)}`}>
                            {file.category}
                          </Badge>
                          {file.size && (
                            <span className="text-gray-500 font-mono text-xs">{formatFileSize(file.size)}</span>
                          )}
                          <span className="text-gray-500 font-mono text-xs">
                            {file.uploadDate.toLocaleDateString()}
                          </span>
                          <span className="text-gray-500 font-mono text-xs">
                            by {file.uploadedBy}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {file.type === "file" && (
                        <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 font-mono">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {files.length === 0 && (
              <div className="text-center py-12">
                <Folder className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-mono">No files uploaded yet</p>
                <p className="text-gray-500 font-mono text-sm mt-2">
                  Project files and deliverables will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Guidelines */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white font-mono flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              File Sharing Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-mono font-semibold mb-3">Supported File Types</h4>
                <div className="space-y-2 text-sm font-mono text-gray-400">
                  <p>• Images: JPG, PNG, GIF, SVG, WebP</p>
                  <p>• Documents: PDF, DOC, DOCX, TXT</p>
                  <p>• Design: PSD, AI, SKETCH, FIG</p>
                  <p>• Archives: ZIP, RAR, TAR</p>
                  <p>• Code: JS, TS, CSS, HTML, JSON</p>
                </div>
              </div>
              <div>
                <h4 className="text-white font-mono font-semibold mb-3">File Requirements</h4>
                <div className="space-y-2 text-sm font-mono text-gray-400">
                  <p>• Maximum file size: 50MB</p>
                  <p>• Virus scanning performed</p>
                  <p>• Files stored securely</p>
                  <p>• Version history maintained</p>
                  <p>• Access controlled by permissions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
}