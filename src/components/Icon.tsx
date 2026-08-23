import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = "w-5 h-5", ...props }) => {
  // Convert icon name string (e.g. "FolderGit2", "User", "Bot") to Lucide component
  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[name];

  if (!IconComponent) {
    const Fallback = LucideIcons.HelpCircle;
    return <Fallback className={className} {...props} />;
  }

  return <IconComponent className={className} {...props} />;
};
