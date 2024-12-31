import React from 'react';
import { cn } from '@/utils/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'region' | 'topic' | 'technology' | 'framework' | 'unknown';
}

const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', className, ...props }) => {
  const baseClasses = 'px-2 py-1 rounded-full text-sm';
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    region: 'bg-green-100 text-green-800',
    topic: 'bg-yellow-100 text-yellow-800',
    technology: 'bg-red-100 text-red-800',
    framework: 'bg-purple-100 text-purple-800',
    country: 'bg-indigo-100 text-indigo-800',
    product_lifecycle: 'bg-teal-100 text-teal-800',
    customer_journey: 'bg-pink-100 text-pink-800',
    unknown: 'bg-gray-100 text-gray-800'
  }[variant];

  return (
    <span className={cn(baseClasses, variantClasses, className)} {...props} />
  );
};

export { Badge };