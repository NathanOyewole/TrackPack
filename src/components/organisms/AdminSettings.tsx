import React, { useState } from 'react';
import Modal from '../atoms/Modal';
import TextInput from '../atoms/TextInput';
import SampleButton from '../atoms/SampleButton';

export interface AdminSettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: (settings: { name: string; email: string; notifyBy: string }) => void;
  initial?: { name: string; email: string; notifyBy: string };
  planInfo?: { plan: 'trial' | 'free' | 'pro' | 'enterprise'; trialDaysLeft: number; trialExpired: boolean };
}

const notifyOptions = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'both', label: 'Both' },
];

const AdminSettings: React.FC<AdminSettingsProps> = ({ open, onClose, onSave, initial, planInfo }) => {
  const [form, setForm] = useState(initial || { name: '', email: '', notifyBy: 'email' });
  return (
    <Modal open={open} onClose={onClose} title="Admin Settings">
      {planInfo && (
        <div className="mb-4 p-3 rounded bg-gray-100 text-sm">
          <strong>Plan:</strong> {planInfo.plan === 'trial' ? (planInfo.trialExpired ? 'Trial expired' : `Trial (${planInfo.trialDaysLeft} day(s) left)`) : planInfo.plan.charAt(0).toUpperCase() + planInfo.plan.slice(1)}
        </div>
      )}
      <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); onSave(form); }}>
        <TextInput label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your Name" />
        <TextInput label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" type="email" />
        <label className="flex flex-col gap-1 text-sm font-medium">
          Notification Preference
          <select
            className="border px-2 py-1 rounded"
            value={form.notifyBy}
            onChange={e => setForm(f => ({ ...f, notifyBy: e.target.value }))}
          >
            {notifyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 justify-end mt-2">
          <SampleButton label="Save" />
          <button type="button" className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminSettings;
