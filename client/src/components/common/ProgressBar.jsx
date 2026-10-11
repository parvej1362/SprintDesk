
export default function ProgressBar({
  progress = 0,
  color = '#6366F1',
  showLabel = true,
  size = 'md',
  className = '',
}) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size] || 'h-2.5';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          <span>Progress</span>
          <span className="text-slate-900 font-semibold">{clampedProgress}%</span>
        </div>
      )}
      <div
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
