import React, { useState } from 'react';
import Modal from '../atoms/Modal';
import TextInput from '../atoms/TextInput';
import SampleButton from '../atoms/SampleButton';

export interface Tenant {
  id: string;
  name: string;
  unit: string;
  contact: string;
}

export interface TenantManagementProps {
  tenants: Tenant[];
  setTenants: (tenants: Tenant[]) => void;
}

const TenantManagement: React.FC<TenantManagementProps> = ({ tenants, setTenants }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Tenant>({ id: '', name: '', unit: '', contact: '' });

  const handleAdd = () => {
    setEditId(null);
    setForm({ id: '', name: '', unit: '', contact: '' });
    setModalOpen(true);
  };
  const handleEdit = (id: string) => {
    const t = tenants.find(t => t.id === id);
    if (t) {
      setEditId(id);
      setForm(t);
      setModalOpen(true);
    }
  };
  const handleDelete = (id: string) => {
    setTenants(tenants.filter(t => t.id !== id));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setTenants(tenants.map(t => t.id === editId ? { ...form, id: editId } : t));
    } else {
      setTenants([...tenants, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="bg-white rounded shadow p-4 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Tenant Management</h2>
        <SampleButton label="Add Tenant" onClick={handleAdd} />
      </div>
      <table className="min-w-full border rounded mb-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1">Name</th>
            <th className="px-2 py-1">Unit</th>
            <th className="px-2 py-1">Contact</th>
            <th className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.length === 0 ? (
            <tr><td colSpan={4} className="text-center py-4 text-gray-500">No tenants found.</td></tr>
          ) : tenants.map(t => (
            <tr key={t.id} className="border-b">
              <td className="px-2 py-1">{t.name}</td>
              <td className="px-2 py-1">{t.unit}</td>
              <td className="px-2 py-1">{t.contact}</td>
              <td className="px-2 py-1 flex gap-2">
                <SampleButton label="Edit" onClick={() => handleEdit(t.id)} />
                <SampleButton label="Delete" onClick={() => handleDelete(t.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Tenant' : 'Add Tenant'}>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <TextInput label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tenant Name" />
          <TextInput label="Unit" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="Unit (e.g. A1)" />
          <TextInput label="Contact" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="Email or Phone" />
          <div className="flex gap-2 justify-end">
            <SampleButton label={editId ? 'Update' : 'Add'} />
            <button type="button" className="px-3 py-1 rounded bg-gray-200" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TenantManagement;
