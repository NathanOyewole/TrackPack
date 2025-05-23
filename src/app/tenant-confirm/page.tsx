import React, { useState } from 'react';
import SampleButton from '../../components/atoms/SampleButton';

export default function TenantConfirmPage() {
    const [confirmed, setConfirmed] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">Confirm Package Pickup</h1>
            {confirmed ? (
                <div className="text-green-600 font-semibold">Thank you! Your pickup is confirmed.</div>
            ) : (
                <SampleButton label="Confirm Pickup" onClick={() => setConfirmed(true)} />
            )}
        </div>
    );
} 
