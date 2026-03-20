import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const variants = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
  secondary:
    'bg-dark-700 hover:bg-dark-600 text-dark-200 border border-dark-600 hover:border-dark-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  ghost: 'hover:bg-dark-700 text-dark-400 hover:text-dark-200',
  outline:
    'border border-primary-500 text-primary-400 hover:bg-primary-500/10'
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
        'transition-all duration-200 focus:outline-none focus:ring-2',
        'focus:ring-offset-2 focus:ring-offset-dark-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};

export default Button;