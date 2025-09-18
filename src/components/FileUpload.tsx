import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Database, FileSpreadsheet, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
    const validExtensions = ['.r', '.R', '.csv', '.xlsx', '.xls', '.txt', '.py', '.sql', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'];
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
        // Create a mock URL for the callback - the actual upload happens in the parent component
        const mockUrl = `https://supabase.co/storage/v1/object/public/research-files/${crypto.randomUUID()}-${file.name}`;
        
        // Call the parent's upload handler
        onFileUploaded(file, mockUrl);
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
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(extension || '')) return <Image className="h-8 w-8 text-purple-600" />;
    return <FileText className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
        isDragActive 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-primary/60 hover:bg-primary/5"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
          isDragActive ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-700"
        )}>
          <Upload className={cn(
            "h-8 w-8 transition-colors",
            isDragActive ? "text-primary" : "text-gray-400"
          )} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {isDragActive ? "Drop files here" : "Upload your files"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your data analysis files, images, or click to browse
          </p>
        </div>
          
          <input
            type="file"
            multiple
            accept=".r,.R,.csv,.xlsx,.xls,.txt,.py,.sql,.png,.jpg,.jpeg,.gif,.bmp,.webp,.svg"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
            aria-label="Upload files"
          />
          
        <Button 
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={isUploading}
          size="lg"
          className="px-8"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </>
          )}
        </Button>
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            <span>R Scripts</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border">
            <Database className="h-3.5 w-3.5 text-green-500" />
            <span>CSV Data</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border">
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
            <span>Excel Files</span>
          </div>
        </div>
      </div>
    </div>
  );
};