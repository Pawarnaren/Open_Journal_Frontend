import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const Textarea = forwardRef(
  ({ label, error, id, rows = 5, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="label">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          className={clsx(
            'input-base resize-y min-h-[100px]',
            error && 'input-error',
            className
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
export default Textarea;
