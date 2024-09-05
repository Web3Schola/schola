import * as React from "react";

const buttonVariants = {
  default: "btn btn-primary",
  destructive: "btn btn-error",
  outline: "btn btn-outline",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
  link: "btn btn-link",
};

const sizeVariants = {
  default: "btn-md",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-square btn-md",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof sizeVariants;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={`btn ${buttonVariants[variant]} ${sizeVariants[size]} ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
