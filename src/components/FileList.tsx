import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, FileText, Database, FileSpreadsheet, CheckCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { GlobalFile } from "@/services/fileService";

interface FileListProps {
  files: GlobalFile[];
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
    if (extension === 'xlsx' || extension === 'xls') return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv': return 'CSV';
      case 'xlsx': return 'Excel';
      case 'xls': return 'Excel';
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
      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium text-foreground mb-2">No files uploaded yet</p>
        <p className="text-sm text-muted-foreground">Upload your data analysis files to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div key={file.id} className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {getFileIcon(file.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate text-sm">
                  {file.name}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {getFileTypeLabel(file.name)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
              
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(file.download_url, file.name)}
                className="flex items-center space-x-1.5 h-8 px-3"
              >
                {copiedUrls.has(file.downloadUrl) ? (
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span className="text-xs">{copiedUrls.has(file.downloadUrl) ? "Copied!" : "Copy"}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(file.download_url, '_blank')}
                className="h-8 px-3"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveFile(file.id)}
                className="h-8 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Download URL:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(file.download_url, file.name)}
                className="h-6 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy URL
              </Button>
            </div>
            <div className="mt-1 text-xs font-mono text-muted-foreground truncate">
              {file.download_url}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};