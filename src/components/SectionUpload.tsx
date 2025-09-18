import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "./FileUpload";
import { FileList } from "./FileList";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileService, GlobalFile, FileCategory } from "@/services/fileService";

interface SectionUploadProps {
  title: string;
  description: string;
  category: FileCategory;
  icon: React.ReactNode;
}

export const SectionUpload = ({ title, description, category, icon }: SectionUploadProps) => {
  const [files, setFiles] = useState<GlobalFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const categoryFiles = await FileService.getFilesByCategory(category);
      setFiles(categoryFiles);
    } catch (error) {
      console.error(`Error loading files for ${category}:`, error);
      toast({
        title: "Error loading files",
        description: `Failed to load files for ${title}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [category, title, toast]);

  const handleFileUploaded = async (file: File, url: string) => {
    try {
      const uploadedFile = await FileService.uploadFile(file, category);
      setFiles(prev => [uploadedFile, ...prev]);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded to ${title}`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    try {
      await FileService.deleteFile(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast({
        title: "File deleted",
        description: "File has been removed successfully",
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFiles();
    setIsRefreshing(false);
  };

  // Load files on component mount
  React.useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-foreground mb-2">Upload Files</h4>
          <FileUpload onFileUploaded={handleFileUploaded} />
        </div>

        <div>
          <h4 className="text-lg font-medium text-foreground mb-2">
            Files ({files.length})
          </h4>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading files...</p>
              </div>
            </div>
          ) : (
            <FileList files={files} onRemoveFile={handleRemoveFile} />
          )}
        </div>
      </div>
    </Card>
  );
};
