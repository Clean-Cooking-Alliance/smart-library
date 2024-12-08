import React from 'react';
import { cn } from '@/utils/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary';
}

const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', className, ...props }) => {
  const baseClasses = 'px-2 py-1 rounded-full text-sm';
  const variantClasses = variant === 'primary' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';

  return (
    <span className={cn(baseClasses, variantClasses, className)} {...props} />
  );
};

export { Badge };