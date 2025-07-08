import React from "react";

type ElementType = "button" | "submit";

interface GenericButtonProps {
    handleAction?: (e: React.MouseEvent<HTMLButtonElement> | any) => void;
    type: ElementType;
    content: string;
    className?: string;
}

export const GenericButton = ({
    content,
    handleAction,
    type,
    className = "bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors",
}: GenericButtonProps) => {
    return (
        <button type={type} onClick={handleAction} className={className}>
            {content}
        </button>
    );
};
