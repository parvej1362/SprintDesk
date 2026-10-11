import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className = '',
}) {
  const [innerValue, setInnerValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setInnerValue(value);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (innerValue !== value) {
        onChange?.(innerValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [innerValue, debounceMs, onChange, value]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={innerValue}
        onChange={(e) => setInnerValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9.5 pr-8 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-hidden"
      />
      {innerValue && (
        <button
          type="button"
          onClick={() => {
            setInnerValue('');
            onChange?.('');
          }}
          className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
