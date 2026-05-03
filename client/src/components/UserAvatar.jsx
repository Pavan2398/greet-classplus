import { useState } from 'react';
import { getImageUrl } from '../utils/getImageUrl';

export default function UserAvatar({ user, size = 'sm', className = '' }) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-4xl',
  };

  const fallbackColor = 'bg-gradient-to-br from-brand-500 to-purple-600';

  if (!user?.profileImage || imageError) {
    return (
      <div 
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shadow-inner ${fallbackColor} ${className}`}
      >
        {getInitials(user?.name)}
      </div>
    );
  }

  return (
    <img
      src={getImageUrl(user.profileImage)}
      alt={user.name}
      onError={() => setImageError(true)}
      className={`${sizes[size]} rounded-full object-cover ring-2 ring-brand-500/30 ${className}`}
    />
  );
}
