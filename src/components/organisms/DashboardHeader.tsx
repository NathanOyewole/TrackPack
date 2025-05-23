import React from 'react';
import SampleButton from '../atoms/SampleButton';

export interface DashboardHeaderProps {
    onAdd: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAdd }) => {
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
    };
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
                <SampleButton label="Logout" onClick={handleLogout} />
            </div>
            <SampleButton label="Add Package" onClick={onAdd} />
        </div>
    );
};

export default DashboardHeader;
