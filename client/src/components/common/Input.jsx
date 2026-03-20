import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-dark-300 mb-1.5"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-dark-500" />
          </div>
        )}

        {/* Input Field */}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full bg-dark-900 border text-dark-200 rounded-lg text-sm',
            'placeholder-dark-500 transition-colors duration-200',
            'focus:outline-none focus:ring-1',
            Icon ? 'pl-10' : 'pl-4',
            isPasswordField ? 'pr-10' : 'pr-4',
            'py-2.5',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          {...props}
        />

        {/* Password Toggle */}
        {isPasswordField && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center
                       text-dark-500 hover:text-dark-300 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-xs text-dark-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;