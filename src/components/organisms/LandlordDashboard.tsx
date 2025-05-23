"use client";

import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import PackageTable from './PackageTable';
import Modal from '../atoms/Modal';
import PackageForm, { PackageFormValues } from '../molecules/PackageForm';
import { Package } from '../molecules/PackageTableRow';

const initialPackages: Package[] = [
    {
        id: '1',
        tenant: 'John Doe',
        unit: 'A1',
        carrier: 'UPS',
        trackingId: '1Z2345',
        contact: 'john@example.com',
        status: 'pending',
    },
    {
        id: '2',
        tenant: 'Jane Smith',
        unit: 'B2',
        carrier: 'FedEx',
        trackingId: '2Y6789',
        contact: 'jane@example.com',
        status: 'notified',
    },
];

const LandlordDashboard: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>(initialPackages);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditId(null);
        setModalOpen(true);
    };

    const handleEdit = (id: string) => {
        setEditId(id);
        setModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setPackages(pkgs => pkgs.filter(pkg => pkg.id !== id));
    };

    const handleSubmit = (values: PackageFormValues) => {
        if (editId) {
            setPackages(pkgs => pkgs.map(pkg => pkg.id === editId ? { ...pkg, ...values } : pkg));
        } else {
            setPackages(pkgs => [
                ...pkgs,
                { ...values, id: Date.now().toString(), status: 'pending' as const },
            ]);
        }
        setModalOpen(false);
    };

    const handleNotify = (id: string) => {
        setPackages(pkgs => pkgs.map(pkg => pkg.id === id ? { ...pkg, status: 'notified' } : pkg));
        // TODO: Trigger notification (email/SMS) here
    };

    const editingPackage = editId ? packages.find(pkg => pkg.id === editId) : undefined;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <DashboardHeader onAdd={handleAdd} />
            <PackageTable
                packages={packages}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNotify={handleNotify}
            />
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Package' : 'Add Package'}>
                <PackageForm
                    initialValues={editingPackage}
                    onSubmit={handleSubmit}
                    submitLabel={editId ? 'Update' : 'Add'}
                />
            </Modal>
        </div>
    );
};

export default LandlordDashboard;
