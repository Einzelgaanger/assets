import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type PageType = 'initial' | 'department' | 'grouped';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const pages = [
    {
      id: 'initial' as PageType,
      label: 'Microsoft 365 Analysis',
      description: 'Productivity reports & insights',
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: 'department' as PageType,
      label: 'Department Analysis',
      description: 'Department-relative productivity',
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 'grouped' as PageType,
      label: 'Grouped Analysis',
      description: 'Cross-departmental insights',
      icon: <Building2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 mb-8">
      <div className="grid grid-cols-3 gap-1">
        {pages.map((page) => (
          <Button
            key={page.id}
            variant={currentPage === page.id ? "default" : "ghost"}
            className={cn(
              "flex flex-col items-center space-y-2 p-4 h-auto",
              currentPage === page.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => onPageChange(page.id)}
          >
            <div className="flex items-center space-x-2">
              {page.icon}
              <span className="font-medium">{page.label}</span>
            </div>
            <span className={cn(
              "text-xs",
              currentPage === page.id
                ? "text-primary-foreground/80"
                : "text-muted-foreground"
            )}>
              {page.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
