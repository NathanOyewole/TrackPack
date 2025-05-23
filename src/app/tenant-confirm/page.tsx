"use client";

import React, { useState } from 'react';
import SampleButton from '../../components/atoms/SampleButton';
import TextInput from '../../components/atoms/TextInput';

export default function TenantConfirmPage() {
    const [trackingId, setTrackingId] = useState('');
    const [found, setFound] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState('');
    // Simulate a package lookup (replace with real API in production)
    const mockPackage = trackingId === '1Z2345' ? {
        tenant: 'John Doe',
        unit: 'A1',
        carrier: 'UPS',
        status: 'notified',
    } : null;

    const handleFind = (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) {
            setError('Please enter a tracking ID.');
            setFound(false);
            return;
        }
        setFound(!!mockPackage);
        setError(!mockPackage ? 'No package found for that tracking ID.' : '');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">Confirm Package Pickup</h1>
            {!found && !confirmed && (
                <form className="flex flex-col gap-3 w-full max-w-xs mb-6" onSubmit={handleFind}>
                    <TextInput label="Tracking ID" value={trackingId} onChange={e => setTrackingId(e.target.value)} placeholder="Enter your tracking ID" />
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    <SampleButton label="Find Package" />
                </form>
            )}
            {found && mockPackage && !confirmed && (
                <div className="bg-white rounded shadow p-4 w-full max-w-xs mb-4 animate-fade-in">
                    <div className="mb-2 font-semibold">Package Details</div>
                    <div><b>Tenant:</b> {mockPackage.tenant}</div>
                    <div><b>Unit:</b> {mockPackage.unit}</div>
                    <div><b>Carrier:</b> {mockPackage.carrier}</div>
                    <div><b>Status:</b> <span className="capitalize text-blue-700">{mockPackage.status.replace('_', ' ')}</span></div>
                    <SampleButton label="Confirm Pickup" onClick={() => setConfirmed(true)} />
                </div>
            )}
            {confirmed && (
                <div className="text-green-600 font-semibold animate-fade-in">Thank you! Your pickup is confirmed.</div>
            )}
            <div className="mt-8 text-gray-500 text-xs">Tip: Ask your landlord for your tracking ID if you don&apos;t know it.</div>
        </div>
    );
}
