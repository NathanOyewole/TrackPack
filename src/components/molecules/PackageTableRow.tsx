import React from 'react';
import StatusBadge from '../atoms/StatusBadge';
import SampleButton from '../atoms/SampleButton';
import ActivityLog from '../atoms/ActivityLog';

export interface Package {
    id: string;
    tenant: string;
    unit: string;
    carrier: string;
    trackingId: string;
    contact: string;
    status: 'pending' | 'picked_up' | 'notified';
    activityLog?: Array<{ action: string; timestamp: string }>;
}

export interface PackageTableRowProps {
    pkg: Package;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onNotify: (id: string, isPickupConfirm?: boolean) => void;
}

const PackageTableRow: React.FC<PackageTableRowProps> = ({ pkg, onEdit, onDelete, onNotify }) => {
    const [showLog, setShowLog] = React.useState(false);
    return (
        <>
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
                    {pkg.status === 'notified' && (
                        <SampleButton label="Confirm Pickup" onClick={() => onNotify(pkg.id, true)} />
                    )}
                    <SampleButton label={showLog ? "Hide Log" : "Show Log"} onClick={() => setShowLog(v => !v)} />
                </td>
            </tr>
            {showLog && (
                <tr>
                    <td colSpan={7}>
                        <ActivityLog log={pkg.activityLog || []} />
                    </td>
                </tr>
            )}
        </>
    );
};

export default PackageTableRow;
