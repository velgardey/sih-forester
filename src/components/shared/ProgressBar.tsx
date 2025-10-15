'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({ 
  value, 
  max = 100, 
  color = 'bg-green-500',
  height = 'h-2',
  showLabel = false,
  label
}: ProgressBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">{label}</span>
          <span className="text-xs font-bold text-gray-800">
            {value}/{max}
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={`${color} ${height} rounded-full transition-all duration-300`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && !label && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">{clampedPercentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}
