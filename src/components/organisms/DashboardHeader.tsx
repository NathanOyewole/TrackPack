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
        <header className="w-full mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
                <div className="flex gap-2 items-center mt-2 sm:mt-0">
                    <SampleButton label="Add Package" onClick={onAdd} />
                    <SampleButton label="Logout" onClick={handleLogout} />
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
