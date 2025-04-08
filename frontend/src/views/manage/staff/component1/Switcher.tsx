// Switcher.tsx or Switcher.js
import React from 'react';

interface SwitcherProps {
    checked: boolean;
    onChange: () => void;
    checkedColor?: string; // Add this line
    unCheckedColor?: string; // Add this line
    checkedContent?: React.ReactNode;
    unCheckedContent?: React.ReactNode;
    className?: string;
}

const Switcher: React.FC<SwitcherProps> = ({
    checked,
    onChange,
    checkedColor = 'green-500',
    unCheckedColor = 'gray-400',
    checkedContent,
    unCheckedContent,
    className
}) => {
    return (
        <div
            onClick={onChange}
            className={`switcher ${className} ${checked ? checkedColor : unCheckedColor}`}
        >
            {checked ? checkedContent : unCheckedContent}
        </div>
    );
};

export default Switcher;