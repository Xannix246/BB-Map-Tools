import clsx from "clsx";
import { useState } from "react";

interface Button extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
    allowActive?: boolean;
    onClick?: () => void;
}

const Button = ({children, leftIcon, rightIcon, className, onClick, allowActive = false, ...props}: Button) => {
    const [active, setActive] = useState(false);

    return (
        <div className="bg-black/70 inline-block w-fit">
            <button 
                className={clsx(active && "text-green", "px-6 py-2 text-xl", className)}
                onClick={() => {
                    allowActive && setActive(!active);
                    onClick && onClick();
                }}
                {...props}
            >
                {leftIcon}
                {children}
                {rightIcon}
            </button>
        </div>
    );
}

export default Button;