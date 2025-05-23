import React from 'react';

/**
 * Atom: TextInput
 * A reusable text input field with label.
 */
export interface TextInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <label className="flex flex-col gap-1 text-sm font-medium">
        {label}
        <input
            className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
        />
    </label>
);

export default TextInput; 
