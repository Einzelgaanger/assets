import { SectionUpload } from "@/components/SectionUpload";
import { BarChart3 } from "lucide-react";

const InitialAnalysisPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Microsoft 365 Productivity Analysis</h2>
        <p className="text-muted-foreground max-w-4xl mx-auto mb-6">
          This page hosts the complete output files generated from the <strong>Microsoft 365 Productivity Analysis</strong>. 
          It provides users with access to detailed reports, visualizations, and data exports that capture insights into 
          communication, collaboration, file activity, and meeting engagement across the organization.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-6 text-left max-w-4xl mx-auto">
          <h3 className="font-semibold text-foreground mb-4">Available Files Include:</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Data Quality Checks</strong> – completeness reports for Teams, Email, SharePoint, OneDrive, and Active Users.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Productivity Drivers Correlation</strong> – statistical correlations between key activity metrics and overall productivity scores.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Performance Benchmarks by Quartile</strong> – breakdown of average scores and engagement across different productivity quartiles.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Overall Productivity Summary</strong> – organization-wide statistics, including averages, medians, and performer distribution.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Department-Wise Analysis</strong> – deep insights into productivity patterns, consistency, and high/low performer rates by department.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Comprehensive Employee List</strong> – ranked list of employees with productivity scores, performance levels, and quartile placement.
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            The page serves as a centralized hub where stakeholders can <strong>download CSV files, view interactive plots, and explore summarized insights</strong> to make informed decisions about workforce productivity and performance improvement strategies.
          </p>
        </div>
      </div>

      <SectionUpload
        title="Upload Initial Analysis Files"
        description="Drag and drop your raw data files, CSV datasets, Excel files, R scripts, images, or any other preliminary analysis files here."
        category="initial"
        icon={<BarChart3 className="h-5 w-5 text-primary" />}
      />
    </div>
  );
};

export default InitialAnalysisPage;
