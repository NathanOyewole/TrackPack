import React from 'react';

/**
 * Atom: StatusBadge
 * Shows a colored badge for package status.
 */
export interface StatusBadgeProps {
    status: 'pending' | 'picked_up' | 'notified';
}

const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    picked_up: 'bg-green-100 text-green-800',
    notified: 'bg-blue-100 text-blue-800',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
    </span>
);

export default StatusBadge; 
