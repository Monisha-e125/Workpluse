import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative ${className}`}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-dark-900 border border-dark-600 text-dark-200 rounded-lg pl-10 pr-8 py-2 text-sm placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors"
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default SearchBar;