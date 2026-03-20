import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Loader = ({ size = 'md', className = '', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn(sizes[size], 'animate-spin text-primary-500')} />
      {text && <p className="text-dark-400 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;