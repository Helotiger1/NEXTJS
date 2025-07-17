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
    className = "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all text-sm shadow-sm w-full md:w-auto",
}: GenericButtonProps) => {
    return (
        <button type={type} onClick={handleAction} className={className}>
            {content}
        </button>
    );
};
