import React from 'react';
import PackageTableRow, { Package } from '../molecules/PackageTableRow';

export interface PackageTableProps {
    packages: Package[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onNotify: (id: string) => void;
}

const PackageTable: React.FC<PackageTableProps> = ({ packages, onEdit, onDelete, onNotify }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
            <thead>
                <tr className="bg-gray-100">
                    <th className="px-2 py-1">Tenant</th>
                    <th className="px-2 py-1">Unit</th>
                    <th className="px-2 py-1">Carrier</th>
                    <th className="px-2 py-1">Tracking ID</th>
                    <th className="px-2 py-1">Contact</th>
                    <th className="px-2 py-1">Status</th>
                    <th className="px-2 py-1">Actions</th>
                </tr>
            </thead>
            <tbody>
                {packages.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="text-center py-4 text-gray-500">No packages found.</td>
                    </tr>
                ) : (
                    packages.map(pkg => (
                        <PackageTableRow key={pkg.id} pkg={pkg} onEdit={onEdit} onDelete={onDelete} onNotify={onNotify} />
                    ))
                )}
            </tbody>
        </table>
    </div>
);

export default PackageTable;
