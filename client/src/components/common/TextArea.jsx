import { cn } from '../../utils/helpers';

const TextArea = ({ label, name, value, onChange, error, placeholder, rows = 3, required, className, ...props }) => (
  <div className={cn('w-full', className)}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-dark-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
    )}
    <textarea
      id={name} name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder}
      className={cn(
        'w-full bg-dark-900 border text-dark-200 rounded-lg px-4 py-2.5 text-sm',
        'placeholder-dark-500 focus:outline-none focus:ring-1 transition-colors resize-none',
        error ? 'border-red-500 focus:ring-red-500' : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500'
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-400">⚠ {error}</p>}
  </div>
);

export default TextArea;