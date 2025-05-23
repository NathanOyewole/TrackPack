import React from 'react';
import StatusBadge from '../atoms/StatusBadge';
import SampleButton from '../atoms/SampleButton';

export interface Package {
    id: string;
    tenant: string;
    unit: string;
    carrier: string;
    trackingId: string;
    contact: string;
    status: 'pending' | 'picked_up' | 'notified';
}

export interface PackageTableRowProps {
    pkg: Package;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onNotify: (id: string) => void;
}

const PackageTableRow: React.FC<PackageTableRowProps> = ({ pkg, onEdit, onDelete, onNotify }) => (
    <tr className="border-b">
        <td className="px-2 py-1">{pkg.tenant}</td>
        <td className="px-2 py-1">{pkg.unit}</td>
        <td className="px-2 py-1">{pkg.carrier}</td>
        <td className="px-2 py-1">{pkg.trackingId}</td>
        <td className="px-2 py-1">{pkg.contact}</td>
        <td className="px-2 py-1"><StatusBadge status={pkg.status} /></td>
        <td className="px-2 py-1 flex gap-2">
            <SampleButton label="Edit" onClick={() => onEdit(pkg.id)} />
            <SampleButton label="Delete" onClick={() => onDelete(pkg.id)} />
            {pkg.status === 'pending' && (
                <SampleButton label="Notify" onClick={() => onNotify(pkg.id)} />
            )}
        </td>
    </tr>
);

export default PackageTableRow;
