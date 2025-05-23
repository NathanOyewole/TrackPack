import React from 'react';
import SampleButton from '../atoms/SampleButton';

export interface DashboardHeaderProps {
    onAdd: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAdd }) => (
    <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
        <SampleButton label="Add Package" onClick={onAdd} />
    </div>
);

export default DashboardHeader; 
