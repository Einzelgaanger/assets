import { SectionUpload } from "@/components/SectionUpload";
import { Button } from "@/components/ui/button";
import { Info, Server, LogOut, BarChart3, Users, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Data Analysis File Hub</h1>
              <p className="text-muted-foreground">
                Upload, store, and share your data analysis files with secure, fast access
              </p>
            </div>
          </div>
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

        {/* Info Banner */}
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
                Files are organized by analysis type and shared globally.
              </p>
            </div>
          </div>
        </div>

        {/* Three Sections */}
        <div className="space-y-8">
          {/* Initial Data Analysis Files */}
          <SectionUpload
            title="Initial Data Analysis Files"
            description="Upload your raw data files, initial datasets, and preliminary analysis files. These are the foundation files for your data analysis projects."
            category="initial"
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
          />

          {/* Department Analysis Files */}
          <SectionUpload
            title="≥1 Employees Department Analysis Files"
            description="Upload department-specific analysis files, employee data reports, and departmental insights. Files for departments with one or more employees."
            category="department"
            icon={<Users className="h-5 w-5 text-green-600" />}
          />

          {/* Grouped Departments Analysis */}
          <SectionUpload
            title="Grouped Departments Analysis"
            description="Upload cross-departmental analysis files, comparative studies, and consolidated reports that span multiple departments or organizational units."
            category="grouped"
            icon={<Building2 className="h-5 w-5 text-purple-600" />}
          />
        </div>

        {/* How to Use Section */}
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
                    <span>Upload files to the appropriate section based on your analysis type</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Files are automatically organized and visible to all users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Download files using the download button or copy the URL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Supports R scripts, CSV files, Excel files, images, and more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;