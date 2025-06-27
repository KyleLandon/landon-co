import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Folder, File, Download, Upload, Image, FileText, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProjectLayout from "./project-layout";

export default function ProjectFiles() {
  const { id } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white font-mono">Loading files...</div>
        </div>
      </ProjectLayout>
    );
  }

  // Sample files (replace with real data when available)
  const sampleFiles = [
    {
      id: 1,
      name: "Project Requirements.pdf",
      type: "document",
      size: "2.3 MB",
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Requirements"
    },
    {
      id: 2,
      name: "Brand Guidelines.pdf",
      type: "document",
      size: "4.1 MB",
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Design"
    },
    {
      id: 3,
      name: "Logo Assets.zip",
      type: "archive",
      size: "15.2 MB",
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Assets"
    },
    {
      id: 4,
      name: "Wireframes.png",
      type: "image",
      size: "800 KB",
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Design"
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-6 h-6 text-white" />;
      case 'document': return <FileText className="w-6 h-6 text-white" />;
      case 'archive': return <Archive className="w-6 h-6 text-white" />;
      default: return <File className="w-6 h-6 text-white" />;
    }
  };

  const categories = Array.from(new Set(sampleFiles.map(file => file.category)));

  return (
    <ProjectLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono mb-2">Project Files</h1>
            <p className="text-white font-mono">Access and manage project documents and assets</p>
          </div>
          <Button className="bg-white text-black hover:bg-gray-200 font-mono">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>

        {/* File Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const categoryFiles = sampleFiles.filter(file => file.category === category);
            const totalSize = categoryFiles.reduce((sum, file) => {
              const sizeInMB = parseFloat(file.size.replace(/[^\d.]/g, ''));
              return sum + (file.size.includes('KB') ? sizeInMB / 1000 : sizeInMB);
            }, 0);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black border-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-mono text-sm">{category}</p>
                        <p className="text-2xl font-bold text-white font-mono">{categoryFiles.length}</p>
                        <p className="text-white font-mono text-sm">{totalSize.toFixed(1)} MB</p>
                      </div>
                      <Folder className="w-8 h-8 text-white" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Files List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-mono">All Files</h2>
          
          {sampleFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black border-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <h3 className="text-white font-mono font-medium">{file.name}</h3>
                        <div className="flex items-center space-x-4 text-white font-mono text-sm mt-1">
                          <span>Size: {file.size}</span>
                          <span>Category: {file.category}</span>
                          <span>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black border-white text-white hover:bg-white hover:text-black font-mono"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {sampleFiles.length === 0 && (
          <Card className="bg-black border-white text-center py-12">
            <CardContent className="pt-6">
              <Folder className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-xl font-mono font-bold mb-2 text-white">No Files Yet</h3>
              <p className="text-white font-mono mb-6">
                Project files and documents will appear here once uploaded.
              </p>
              <Button className="bg-white text-black hover:bg-gray-200 font-mono">
                <Upload className="w-4 h-4 mr-2" />
                Upload First File
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProjectLayout>
  );
}