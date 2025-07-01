interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final': return 'bg-green-100 text-green-800 border-green-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'withdrawn': return 'bg-red-100 text-red-800 border-red-200';
      case 'superseded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'px-2 py-0.5 text-xs';
      case 'md': return 'px-2.5 py-0.5 text-xs';
      case 'lg': return 'px-3 py-1 text-sm';
      default: return 'px-2.5 py-0.5 text-xs';
    }
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium border ${getStatusColor(status)} ${getSizeClasses(size)}`}
    >
      {status}
    </span>
  );
}
