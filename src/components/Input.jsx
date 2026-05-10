import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(
  ({ label, error, id, className = '', helpText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="label">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={clsx('input-base', error && 'input-error', className)}
          {...props}
        />
        {helpText && !error && (
          <p className="text-xs text-slate-500">{helpText}</p>
        )}
        {error && (
          <p className="error-msg">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
