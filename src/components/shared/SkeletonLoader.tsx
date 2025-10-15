'use client';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'rectangle';
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ 
  variant = 'rectangle', 
  width = '100%', 
  height = '20px',
  count = 1,
  className = ''
}: SkeletonLoaderProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'rounded-xl';
      case 'text':
        return 'rounded h-4';
      case 'circle':
        return 'rounded-full';
      case 'rectangle':
      default:
        return 'rounded-lg';
    }
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`skeleton ${getVariantClasses()} ${className}`}
      style={{ width, height }}
    />
  ));

  return count > 1 ? (
    <div className="space-y-3">
      {skeletons}
    </div>
  ) : (
    skeletons[0]
  );
}

// Specific skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <SkeletonLoader variant="text" width="60%" height="24px" className="mb-4" />
      <SkeletonLoader variant="rectangle" width="100%" height="150px" className="mb-3" />
      <SkeletonLoader variant="text" width="80%" count={3} />
    </div>
  );
}

export function InfoCardsSkeleton() {
  return (
    <div className="space-y-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function DocumentCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <SkeletonLoader variant="circle" width="40px" height="40px" />
        <SkeletonLoader variant="text" width="80px" height="24px" />
      </div>
      <SkeletonLoader variant="text" width="90%" height="20px" className="mb-2" />
      <SkeletonLoader variant="text" width="70%" count={3} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200">
          <SkeletonLoader variant="circle" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" width="60%" />
            <SkeletonLoader variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}
