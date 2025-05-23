import React, { useState } from 'react';
import SampleButton from '../atoms/SampleButton';

/**
 * Molecule: SampleForm
 * A simple form using the SampleButton atom.
 */
const SampleForm: React.FC = () => {
    const [value, setValue] = useState('');
    return (
        <form className="flex gap-2 items-center">
            <input
                className="border px-2 py-1 rounded"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Type something..."
            />
            <SampleButton label="Submit" onClick={e => { e.preventDefault(); alert(value); }} />
        </form>
    );
};

export default SampleForm; 
