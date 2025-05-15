
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <CardDescription className="text-sm font-medium mb-1">
              {title}
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{value}</CardTitle>
            
            {trend && (
              <div className={cn(
                "flex items-center text-xs mt-1",
                trend.direction === 'up' && "text-green-500",
                trend.direction === 'down' && "text-red-500",
                trend.direction === 'neutral' && "text-muted-foreground"
              )}>
                {trend.direction === 'up' && '↑ '}
                {trend.direction === 'down' && '↓ '}
                {trend.direction === 'neutral' && '→ '}
                {trend.value}
              </div>
            )}
          </div>
          
          <div className="rounded-full p-2 bg-brand-primary bg-opacity-10">
            <Icon className="h-5 w-5 text-brand-primary" />
          </div>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
