import { SectionUpload } from "@/components/SectionUpload";
import { Users } from "lucide-react";

const DepartmentAnalysisPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Department-Relative Productivity Analysis</h2>
        <p className="text-muted-foreground max-w-4xl mx-auto mb-6">
          This page hosts the full outputs from the <strong>Department-Relative Productivity Analysis</strong>. 
          It contains Excel and CSV files that break down employee activity, engagement, and performance 
          <strong> within the context of their departments</strong>, ensuring that comparisons are fair and statistically valid.
        </p>
        
        <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 text-left max-w-4xl mx-auto">
          <h3 className="font-semibold text-foreground mb-4">Available Files Include:</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Department Individual Files (Excel)</strong> – employee rankings, detailed activity analysis, outlier detection, and department-specific statistics.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Department Summary Statistics (CSV/Excel)</strong> – average scores, medians, performance distribution, and variation measures across departments.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>All Department Outliers (CSV/Excel)</strong> – consolidated list of employees flagged as statistical outliers in communication, collaboration, or meeting activity.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Department vs. Organization Rankings (CSV/Excel)</strong> – comparison of employee standing within their department relative to their organization-wide ranking.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Master Department Analysis Summary (Excel)</strong> – a centralized file combining summary statistics, outliers, and ranking comparisons for all departments.
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This page serves as the <strong>department-focused hub</strong> for stakeholders to explore 
            <strong> performance drivers, engagement disparities, and improvement opportunities</strong> at both the departmental and organizational levels. 
            All files are downloadable for further analysis and reporting.
          </p>
        </div>
      </div>

      <SectionUpload
        title="Upload Department Analysis Files"
        description="Drag and drop your department-specific files, employee reports, departmental datasets, analysis results, or any department-focused files here."
        category="department"
        icon={<Users className="h-5 w-5 text-green-600" />}
      />
    </div>
  );
};

export default DepartmentAnalysisPage;
