import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, Server, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation, PageType } from "@/components/Navigation";
import InitialAnalysisPage from "./InitialAnalysisPage";
import DepartmentAnalysisPage from "./DepartmentAnalysisPage";
import GroupedAnalysisPage from "./GroupedAnalysisPage";

const Index = () => {
  const { isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('initial');

  if (!isAuthenticated) {
    return null;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'initial':
        return <InitialAnalysisPage />;
      case 'department':
        return <DepartmentAnalysisPage />;
      case 'grouped':
        return <GroupedAnalysisPage />;
      default:
        return <InitialAnalysisPage />;
    }
  };

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

        {/* Navigation */}
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

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
                Files are organized by analysis type and shared globally across all users.
              </p>
            </div>
          </div>
        </div>

        {/* Current Page Content */}
        {renderCurrentPage()}

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
                    <span>Navigate between analysis types using the tabs above</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Upload files to the appropriate page based on your analysis type</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Files are automatically organized and visible to all users</span>
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