import React from 'react';

/**
 * Atom: SampleButton
 * A simple reusable button component.
 */
export interface SampleButtonProps {
    label: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SampleButton: React.FC<SampleButtonProps> = ({ label, onClick }) => (
    <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={onClick}
    >
        {label}
    </button>
);

export default SampleButton; 
