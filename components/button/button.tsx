import React from 'react';


interface ButtonProps {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
}

export const Button = ({ children, className, ...props }: ButtonProps) => (
  <button className={`button ${className}`} {...props}>
    {children}
  </button>
);


