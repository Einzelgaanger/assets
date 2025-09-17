import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, FileText, Database, CheckCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  downloadUrl: string;
  type: string;
}

interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (id: string) => void;
}

export const FileList = ({ files, onRemoveFile }: FileListProps) => {
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const copyToClipboard = async (url: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls(prev => new Set(prev).add(url));
      
      toast({
        title: "Link copied!",
        description: `Download link for ${fileName} copied to clipboard`,
      });
      
      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(url);
          return newSet;
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'csv') return <Database className="h-5 w-5 text-success" />;
    if (extension === 'r') return <FileText className="h-5 w-5 text-primary" />;
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv': return 'CSV';
      case 'r': return 'R Script';
      case 'txt': return 'Text';
      case 'py': return 'Python';
      case 'sql': return 'SQL';
      case 'png': return 'PNG Image';
      default: return 'File';
    }
  };

  if (files.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No files uploaded yet</p>
          <p className="text-sm mt-1">Upload files to generate download links</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Uploaded Files ({files.length})
        </h2>
      </div>
      
      <div className="space-y-3">
        {files.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getFileTypeLabel(file.name)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(file.uploadedAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(file.downloadUrl, file.name)}
                  className="flex items-center space-x-1"
                >
                  {copiedUrls.has(file.downloadUrl) ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span>{copiedUrls.has(file.downloadUrl) ? "Copied!" : "Copy Link"}</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(file.downloadUrl, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveFile(file.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-muted rounded text-xs font-mono text-muted-foreground truncate">
              {file.downloadUrl}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};