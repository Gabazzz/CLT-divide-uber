import React from 'react';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/helpers';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  photoUrl?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  color,
  size = 'md',
  selected,
  className,
  photoUrl,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full font-semibold text-white transition-transform overflow-hidden',
        sizeClasses[size],
        selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-main scale-105' : '',
        className
      )}
      style={!photoUrl ? { backgroundColor: color || '#4F46E5' } : {}}
      {...props}
    >
      {photoUrl ? (
        <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
};
