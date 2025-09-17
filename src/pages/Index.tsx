import { useState, useEffect, useCallback } from "react";
import { FileUpload } from "@/components/FileUpload";
import { FileList } from "@/components/FileList";
import { Button } from "@/components/ui/button";
import { Info, Server, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FileService, GlobalFile } from "@/services/fileService";
import { useToast } from "@/hooks/use-toast";


const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<GlobalFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { logout } = useAuth();
  const { toast } = useToast();

  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const files = await FileService.getAllFiles();
      setUploadedFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error loading files",
        description: "Failed to load files from storage",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleFileUploaded = async (file: File, url: string) => {
    try {
      const globalFile = await FileService.uploadFile(file);
      setUploadedFiles(prev => [globalFile, ...prev]);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is now available to all users`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = async (id: string) => {
    try {
      await FileService.deleteFile(id);
      setUploadedFiles(prev => prev.filter(file => file.id !== id));
      
      toast({
        title: "File deleted",
        description: "File has been removed from the system",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFiles();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with logout button */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Data Analysis File Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload, store, and share your data analysis files with secure, fast access
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Files are shared globally - anyone with access can download them
            </p>
          </div>
          <div className="flex items-center space-x-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Secure Cloud Storage</h3>
              <p className="text-sm text-muted-foreground">
                Your files are stored securely with automatic caching for instant access. 
                Works offline after initial load.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading files...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Upload Files
                </h2>
                <p className="text-muted-foreground">
                  Drag and drop your data analysis files or click to browse
                </p>
              </div>
              <FileUpload onFileUploaded={handleFileUploaded} />
            </section>

            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Global Files
                </h2>
                <p className="text-muted-foreground">
                  {uploadedFiles.length > 0 
                    ? `${uploadedFiles.length} file${uploadedFiles.length === 1 ? '' : 's'} available globally`
                    : 'No files uploaded yet'
                  }
                </p>
              </div>
              <FileList 
                files={uploadedFiles} 
                onRemoveFile={handleRemoveFile}
              />
            </section>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-12">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How to Use Your Files</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Copy download links and paste them into your reports</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Files download directly when links are clicked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>No need for recipients to visit this website</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default Index;