"use client";

import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import PackageTable from './PackageTable';
import Modal from '../atoms/Modal';
import PackageForm, { PackageFormValues } from '../molecules/PackageForm';
import { Package } from '../molecules/PackageTableRow';
import Toast from '../atoms/Toast';
import AdminSettings from './AdminSettings';

const initialPackages: Package[] = [
    {
        id: '1',
        tenant: 'John Doe',
        unit: 'A1',
        carrier: 'UPS',
        trackingId: '1Z2345',
        contact: 'john@example.com',
        status: 'pending',
        activityLog: [
            { action: 'Package added', timestamp: new Date().toISOString() },
        ],
    },
    {
        id: '2',
        tenant: 'Jane Smith',
        unit: 'B2',
        carrier: 'FedEx',
        trackingId: '2Y6789',
        contact: 'jane@example.com',
        status: 'notified',
        activityLog: [
            { action: 'Package added', timestamp: new Date().toISOString() },
            { action: 'Tenant notified', timestamp: new Date().toISOString() },
        ],
    },
];

const LandlordDashboard: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>(initialPackages);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [adminSettings, setAdminSettings] = useState({ name: 'Landlord', email: 'landlord@email.com', notifyBy: 'email' });

    const handleAdd = () => {
        setEditId(null);
        setModalOpen(true);
    };

    const handleEdit = (id: string) => {
        setEditId(id);
        setModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            setPackages(pkgs => pkgs.map(pkg =>
                pkg.id === deleteId
                    ? {
                        ...pkg,
                        activityLog: [
                            ...(pkg.activityLog || []),
                            { action: 'Package deleted', timestamp: new Date().toISOString() },
                        ],
                    }
                    : pkg
            ).filter(pkg => pkg.id !== deleteId));
            setToast({ message: 'Package deleted.', type: 'success' });
            setDeleteId(null);
        }
    };

    const cancelDelete = () => setDeleteId(null);

    const handleSubmit = (values: PackageFormValues) => {
        const now = new Date().toISOString();
        if (editId) {
            setPackages(pkgs => pkgs.map(pkg =>
                pkg.id === editId
                    ? {
                        ...pkg,
                        ...values,
                        activityLog: [
                            ...(pkg.activityLog || []),
                            { action: 'Package updated', timestamp: now },
                        ],
                    }
                    : pkg
            ));
            setToast({ message: 'Package updated.', type: 'success' });
        } else {
            setPackages(pkgs => [
                ...pkgs,
                {
                    ...values,
                    id: Date.now().toString(),
                    status: 'pending' as const,
                    activityLog: [
                        { action: 'Package added', timestamp: now },
                    ],
                },
            ]);
            setToast({ message: 'Package added.', type: 'success' });
        }
        setModalOpen(false);
    };

    const handleNotify = (id: string, confirmPickup?: boolean) => {
        const now = new Date().toISOString();
        if (confirmPickup) {
            setPackages(pkgs => pkgs.map(pkg =>
                pkg.id === id
                    ? {
                        ...pkg,
                        status: 'picked_up',
                        activityLog: [
                            ...(pkg.activityLog || []),
                            { action: 'Package picked up', timestamp: now },
                        ],
                    }
                    : pkg
            ));
            setToast({ message: 'Package marked as picked up!', type: 'success' });
        } else {
            setPackages(pkgs => pkgs.map(pkg =>
                pkg.id === id
                    ? {
                        ...pkg,
                        status: 'notified',
                        activityLog: [
                            ...(pkg.activityLog || []),
                            { action: 'Tenant notified', timestamp: now },
                        ],
                    }
                    : pkg
            ));
            setToast({ message: 'Tenant notified!', type: 'info' });
        }
    };

    // Export CSV
    const exportCSV = () => {
        const headers = ['Tenant', 'Unit', 'Carrier', 'Tracking ID', 'Contact', 'Status'];
        const rows = packages.map(pkg => [pkg.tenant, pkg.unit, pkg.carrier, pkg.trackingId, pkg.contact, pkg.status]);
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `package-logs-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredPackages = packages.filter(pkg => {
        const matchesSearch =
            pkg.tenant.toLowerCase().includes(search.toLowerCase()) ||
            pkg.unit.toLowerCase().includes(search.toLowerCase()) ||
            pkg.carrier.toLowerCase().includes(search.toLowerCase()) ||
            pkg.trackingId.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? pkg.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const editingPackage = editId ? packages.find(pkg => pkg.id === editId) : undefined;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
            <div className="flex flex-col md:flex-row gap-2 mb-4">
                <input
                    className="border rounded px-2 py-1 flex-1"
                    placeholder="Search by tenant, unit, carrier, tracking ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="border rounded px-2 py-1"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="notified">Notified</option>
                    <option value="picked_up">Picked Up</option>
                </select>
                <button
                    className="px-3 py-1 rounded bg-blue-600 text-white"
                    onClick={exportCSV}
                >
                    Export CSV
                </button>
            </div>
            <DashboardHeader onAdd={handleAdd} />
            <PackageTable
                packages={filteredPackages.filter(pkg => pkg.status !== 'picked_up')}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNotify={handleNotify}
            />
            {/* Picked Up Packages Section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-2">Picked Up Packages</h2>
                <PackageTable
                    packages={filteredPackages.filter(pkg => pkg.status === 'picked_up')}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onNotify={handleNotify}
                />
            </div>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Package' : 'Add Package'}>
                <PackageForm
                    initialValues={editingPackage}
                    onSubmit={handleSubmit}
                    submitLabel={editId ? 'Update' : 'Add'}
                />
            </Modal>
            <Modal open={!!deleteId} onClose={cancelDelete} title="Confirm Delete">
                <div className="mb-4">Are you sure you want to delete this package?</div>
                <div className="flex gap-2 justify-end">
                    <button className="px-3 py-1 rounded bg-gray-200" onClick={cancelDelete}>Cancel</button>
                    <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={confirmDelete}>Delete</button>
                </div>
            </Modal>
            <button className="mb-4 px-3 py-1 rounded bg-gray-100 border self-end" onClick={() => setSettingsOpen(true)}>
                Admin Settings
            </button>
            <AdminSettings
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                onSave={settings => { setAdminSettings(settings); setSettingsOpen(false); setToast({ message: 'Settings saved!', type: 'success' }); }}
                initial={adminSettings}
            />
        </div>
    );
};

export default LandlordDashboard;
