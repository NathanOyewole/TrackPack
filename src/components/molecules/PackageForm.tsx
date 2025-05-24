"use client";

import React, { useState } from 'react';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import SampleButton from '../atoms/SampleButton';

/**
 * Molecule: PackageForm
 * Form for adding/editing a package.
 */
export interface PackageFormValues {
    tenant: string;
    unit: string;
    carrier: string;
    trackingId: string;
    contact: string;
}

export interface PackageFormProps {
    initialValues?: PackageFormValues;
    onSubmit: (values: PackageFormValues) => void;
    submitLabel?: string;
}

const carrierOptions = [
    { value: 'UPS', label: 'UPS' },
    { value: 'FedEx', label: 'FedEx' },
    { value: 'USPS', label: 'USPS' },
    { value: 'Amazon', label: 'Amazon' },
];

const PackageForm: React.FC<PackageFormProps> = ({ initialValues, onSubmit, submitLabel = 'Save' }) => {
    const [form, setForm] = useState<PackageFormValues>(
        initialValues || { tenant: '', unit: '', carrier: '', trackingId: '', contact: '' }
    );

    const handleChange = (key: keyof PackageFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(f => ({ ...f, [key]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <TextInput label="Tenant Name" value={form.tenant} onChange={handleChange('tenant')} placeholder="John Doe" />
            <TextInput label="Unit" value={form.unit} onChange={handleChange('unit')} placeholder="A1" />
            <SelectInput label="Carrier" value={form.carrier} onChange={handleChange('carrier')} options={carrierOptions} />
            <TextInput label="Tracking ID" value={form.trackingId} onChange={handleChange('trackingId')} placeholder="1Z2345" />
            <TextInput label="Contact (Email/SMS)" value={form.contact} onChange={handleChange('contact')} placeholder="john@example.com" />
            <SampleButton label={submitLabel} />
        </form>
    );
};

export default PackageForm;
