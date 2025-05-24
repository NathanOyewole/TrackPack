import React from 'react';
import SampleForm from '../molecules/SampleForm';

/**
 * Organism: SampleDashboard
 * A simple dashboard using the SampleForm molecule.
 */
const SampleDashboard: React.FC = () => (
    <div className="p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Sample Dashboard</h2>
        <SampleForm />
    </div>
);

export default SampleDashboard; 
