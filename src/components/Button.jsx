import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const variantMap = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <button
      className={clsx(variantMap[variant], sizeMap[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : Icon ? (
        <Icon size={15} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
