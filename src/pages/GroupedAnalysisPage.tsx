import { SectionUpload } from "@/components/SectionUpload";
import { Building2 } from "lucide-react";

const GroupedAnalysisPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Grouped Departments Analysis</h2>
        <p className="text-muted-foreground max-w-4xl mx-auto mb-6">
          In this productivity analysis, departments are reported both individually and in grouped formats to ensure fair comparisons and meaningful insights. 
          Some functions within the organization operate as stand-alone teams, while others naturally overlap in scope or share responsibilities.
        </p>
        
        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-6 text-left max-w-4xl mx-auto">
          <h3 className="font-semibold text-foreground mb-4">Department Grouping Strategy:</h3>
          <div className="grid gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Stand-alone Teams</strong> – Some functions operate independently (e.g., <em>Strategy Dept</em> or <em>Legal</em>)
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Overlapping Functions</strong> – Others naturally overlap in scope or share responsibilities (e.g., <em>Investment</em> and <em>Investment Team</em>)
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Combined Entities</strong> – <em>Operations & Execution</em> is treated as a combined entity because the work of execution staff is tightly integrated with operational decision-making
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Specialized Functions</strong> – Smaller functions like <em>Credit Risk & Portfolio Management</em> and <em>Product Marketing Associate</em> are highlighted individually but may be compared alongside larger clusters
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Analysis Benefits:</h4>
            <p className="text-sm text-muted-foreground">
              This approach balances granularity with fairness, ensuring that departments with very few members are not overrepresented in rankings 
              and that larger, more collaborative teams are assessed on their ability to scale performance. By grouping related departments where necessary, 
              the analysis captures both the excellence of niche teams and the effectiveness of broader, multi-role structures.
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            This provides leaders with a clearer view of where high productivity is driven by <strong>individual specialization</strong>, 
            and where it stems from <strong>collective collaboration</strong> across larger units.
          </p>
        </div>
      </div>

      <SectionUpload
        title="Upload Grouped Analysis Files"
        description="Drag and drop your cross-departmental files, comparative studies, consolidated reports, organization-wide analysis, or any multi-department files here."
        category="grouped"
        icon={<Building2 className="h-5 w-5 text-purple-600" />}
      />
    </div>
  );
};

export default GroupedAnalysisPage;
