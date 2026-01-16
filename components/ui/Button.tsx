import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold font-display rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-background-dark hover:bg-primary-dark shadow-[0_0_15px_-3px_rgba(247,147,26,0.4)]",
    secondary: "bg-surface-highlight border border-white/10 text-text-main hover:bg-white/10",
    danger: "bg-error/10 text-error border border-error/30 hover:bg-error/20",
    ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-white/5",
  };

  const sizes = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-3 px-5",
    lg: "text-base py-4 px-6",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: size === 'sm' ? '16px' : '20px' }}>{icon}</span>}
      {children}
    </button>
  );
};