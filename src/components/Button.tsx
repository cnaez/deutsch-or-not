import {
  FC,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  useRef,
} from "react";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
};

const Button: FC<ButtonProps> = ({
  children,
  className,
  disabled,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
    const button = buttonRef.current;
    if (!button) return;

    // Remove any existing ripple elements
    button.querySelectorAll(".ripple").forEach((ripple) => ripple.remove());

    // Create ripple element
    const ripple = document.createElement("span");
    ripple.className = "ripple";

    // Calculate ripple size and position
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    // Remove the ripple element after animation
    setTimeout(() => {
      ripple.remove();
    }, 600); // Duration of the ripple animation
  };

  return (
    <button
      {...props}
      className={`relative overflow-hidden bg-blue-700 text-white py-4 px-6 rounded-lg shadow-md transition-colors ${
        disabled ? "cursor-not-allowed" : "hover:bg-blue-800 active:bg-blue-900"
      } ${className}`}
      onClick={handleClick}
      ref={buttonRef}
    >
      {children}
    </button>
  );
};

export default Button;
