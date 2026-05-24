import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-dim mb-2">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dim">{icon}</div>}
        <input
          className={`w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-bright placeholder-dim/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all ${icon ? 'pl-10' : ''} ${error ? 'border-accent' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-accent">{error}</p>}
    </div>
  );
}
