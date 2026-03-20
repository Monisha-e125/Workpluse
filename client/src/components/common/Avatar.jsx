import { cn, getInitialsFromNames, getAvatarColor } from '../../utils/helpers';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl'
};

const Avatar = ({
  src,
  firstName = '',
  lastName = '',
  size = 'md',
  className = '',
  showStatus = false,
  isOnline = false
}) => {
  const initials = getInitialsFromNames(firstName, lastName);
  const colorClass = getAvatarColor(`${firstName}${lastName}`);

  return (
    <div className={cn('relative inline-flex', className)}>
      {src ? (
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          className={cn(
            'rounded-full object-cover border-2 border-dark-600',
            sizes[size]
          )}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}

      {/* Fallback Initials */}
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white border-2 border-dark-600',
          colorClass,
          sizes[size],
          src ? 'hidden' : 'flex'
        )}
      >
        {initials}
      </div>

      {/* Online Status Indicator */}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-dark-800',
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3',
            isOnline ? 'bg-green-500' : 'bg-dark-500'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;