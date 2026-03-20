import { cn } from '../../utils/helpers';

const Select = ({ label, name, value, onChange, options = [], error, required, className, placeholder, ...props }) => (
  <div className={cn('w-full', className)}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-dark-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
    )}
    <select
      id={name} name={name} value={value} onChange={onChange}
      className={cn(
        'w-full bg-dark-900 border text-dark-200 rounded-lg px-4 py-2.5 text-sm',
        'focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500'
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-400">⚠ {error}</p>}
  </div>
);

export default Select;