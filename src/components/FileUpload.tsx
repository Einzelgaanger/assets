import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Database, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  onFileUploaded: (file: File, url: string) => void;
}

export const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.r', '.R', '.csv', '.xlsx', '.xls', '.txt', '.py', '.sql', '.png'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload R files (.R), CSV files (.csv), Excel files (.xlsx, .xls), text files (.txt), or PNG images (.png)",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      if (!validateFile(file)) continue;
      
      setIsUploading(true);
      
      try {
        const filePath = `${crypto.randomUUID()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('research-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('research-files')
          .getPublicUrl(filePath, { download: true });

        const publicUrl = data.publicUrl;

        onFileUploaded(file, publicUrl);

        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for download`,
        });
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error?.message || "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFiles(files);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'csv') return <Database className="h-8 w-8 text-success" />;
    if (extension === 'r') return <FileText className="h-8 w-8 text-primary" />;
    if (extension === 'xlsx' || extension === 'xls') return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    return <FileText className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <Card className="p-6">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-upload-border bg-upload-bg hover:border-primary/60"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Upload your files
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop R files, CSV files, Excel files, PNG images, or click to browse
            </p>
          </div>
          
          <input
            type="file"
            multiple
            accept=".r,.R,.csv,.xlsx,.xls,.txt,.py,.sql,.png"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
            aria-label="Upload files"
          />
          
          <Button 
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
            className="mt-4"
          >
            {isUploading ? "Uploading..." : "Choose Files"}
          </Button>
          
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>R files</span>
            </div>
            <div className="flex items-center space-x-1">
              <Database className="h-4 w-4" />
              <span>CSV files</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel files</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};