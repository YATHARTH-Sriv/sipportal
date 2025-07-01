import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

interface LoadingCardProps {
  count?: number;
}

export function LoadingCard({ count = 1 }: LoadingCardProps) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-5 bg-gray-200 rounded-full w-12"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-md mb-3 w-3/4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded-md mb-4 w-24"></div>
          <div className="flex gap-3">
            <div className="h-9 bg-gray-200 rounded-lg flex-1"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-20"></div>
          </div>
        </div>
      ))}
    </>
  );
}
