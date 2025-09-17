import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { FileList } from "@/components/FileList";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Server } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  downloadUrl: string;
  type: string;
}

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileUploaded = (file: File, url: string) => {
    const newFile: UploadedFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      downloadUrl: url,
      type: file.type,
    };
    
    setUploadedFiles(prev => [newFile, ...prev]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Research File Repository
          </h1>
          <p className="text-muted-foreground">
            Professional file hosting and sharing platform for research data, reports, and analysis files
          </p>
        </div>

        <Alert className="mb-6">
          <Server className="h-4 w-4" />
          <AlertDescription>
            Secure file storage powered by Supabase. Files are automatically cached for fast access and available offline.
            Connect to Supabase to enable persistent file storage.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Upload Files
            </h2>
            <FileUpload onFileUploaded={handleFileUploaded} />
          </section>

          <Separator />

          <section>
            <FileList 
              files={uploadedFiles} 
              onRemoveFile={handleRemoveFile}
            />
          </section>

          {uploadedFiles.length > 0 && (
            <>
              <Separator />
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">
                      How to use these links:
                    </p>
                    <ul className="text-muted-foreground space-y-1 text-xs">
                      <li>• Copy the download links and paste them into your PDF report</li>
                      <li>• When someone clicks the link, the file will download directly</li>
                      <li>• No need for recipients to visit this website</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;