"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import {
  RippleButton,
  RippleButtonRipples,
  type RippleButtonProps,
} from '@/components/animate-ui/primitives/buttons/ripple';

interface ButtonProps extends Readonly<ButtonHTMLAttributes<HTMLButtonElement>> {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly variant?: "primary" | "secondary";
}

export default function Button({
  children,
  disabled = false,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  const baseClasses = "w-full text-white font-medium py-3 px-6 rounded-[12px] transition-colors cursor-pointer disabled:rounded-[12px] disabled:bg-[rgba(187,6,19,0.30)] disabled:hover:bg-[rgba(187,6,19,0.30)] disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: {
      backgroundColor: disabled ? 'rgba(187,6,19,0.30)' : 'var(--Primary-Red, #BB0613)'
    },
    secondary: {
      backgroundColor: disabled ? 'rgba(187,6,19,0.30)' : 'var(--Primary-Red, #BB0613)'
    }
  };

  // Exclude children from props to avoid conflicts with explicit children prop
  const { children: _propsChildren, ...restProps } = props as ButtonHTMLAttributes<HTMLButtonElement>;
  // _propsChildren is intentionally unused
  
  return (
    <RippleButton
      type={type}
      disabled={disabled}
      hoverScale={1}
      tapScale={1}
      className={`${baseClasses} ${className}`}
      style={variantStyles[variant]}
      onClick={onClick}
      asChild={false}
      {...(restProps as Omit<RippleButtonProps, 'children' | 'asChild'>)}
    >
      <>
        {children}
        <RippleButtonRipples
          color="rgba(255, 255, 255, 0.3)"
          scale={15}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </>
    </RippleButton>
  );
}
