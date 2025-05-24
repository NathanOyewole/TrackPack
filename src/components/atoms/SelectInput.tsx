import React from 'react';

/**
 * Atom: SelectInput
 * A reusable select/dropdown input field with label.
 */
export interface SelectInputProps {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, onChange }) => (
    <label className="flex flex-col gap-1 text-sm font-medium">
        {label}
        <select
            className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={value}
            onChange={onChange}
        >
            <option value="">Select...</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </label>
);

export default SelectInput; 
