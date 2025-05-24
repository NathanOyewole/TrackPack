"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardHeader from './DashboardHeader';
import PackageTable from './PackageTable';
import Modal from '../atoms/Modal';
import PackageForm, { PackageFormValues } from '../molecules/PackageForm';
import { Package } from '../molecules/PackageTableRow';
import Toast from '../atoms/Toast';
import AdminSettings from './AdminSettings';
import TenantManagement from './TenantManagement';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { loadStripe } from '@stripe/stripe-js';
import { auth } from '../../firebase';
import Cookies from 'js-cookie';
import { signOut, onAuthStateChanged } from 'firebase/auth';

// Stripe publishable key (test mode)
const stripePromise = loadStripe('pk_test_51RSC7CIbJmvyHDypcdnK9PaMpxE4MqQ3IgSanpBzgYl3gMRoOWBfmccmQ4bD4meWTpBSxcNfUn5oC4UgvZjkFw0W002LgkZidW');

// Replace hardcoded API URL with env variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const LandlordDashboard: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [adminSettings, setAdminSettings] = useState({ name: 'Landlord', email: 'landlord@email.com', notifyBy: 'email' });
    const [tenants, setTenants] = useState([
        { id: '1', name: 'John Doe', unit: 'A1', contact: 'john@example.com' },
        { id: '2', name: 'Jane Smith', unit: 'B2', contact: 'jane@example.com' },
    ]);
    const [activeSection, setActiveSection] = useState<'packages' | 'tenants' | 'settings' | 'pricing'>('packages');

    // Example: Pricing plans (could be fetched from Firestore or static)
    const PRICING_PLANS = [
        { id: 'free', name: 'Free', price: 0, features: ['Basic package tracking', 'Unlimited tenants'] },
        { id: 'pro', name: 'Pro', price: 29, features: ['Everything in Free', 'SMS/email notifications', 'Branded notifications', 'Analytics & reporting'] },
        { id: 'enterprise', name: 'Enterprise', price: 99, features: ['Everything in Pro', 'API access', 'White-label', 'Priority support'] },
    ];

    // User plan/trial state
    const [userPlan, setUserPlan] = useState<'trial' | 'free' | 'pro' | 'enterprise'>('trial');
    const [trialExpired, setTrialExpired] = useState(false);
    const [trialDaysLeft, setTrialDaysLeft] = useState<number>(3);

    // Auth state
    const [authLoading, setAuthLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check Firebase Auth state on mount
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                window.location.href = '/login';
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Only fetch dashboard data if authenticated
    useEffect(() => {
        if (!isAuthenticated) return;
        setLoading(true);
        const unsub = onSnapshot(collection(db, 'packages'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPackages(data as Package[]);
            setLoading(false);
        }, () => {
            setError('Could not load packages.');
            setLoading(false);
        });
        return () => unsub();
    }, [isAuthenticated]);

    // Only fetch user plan/trial info if authenticated
    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchUserPlan = async () => {
            const uid = localStorage.getItem('uid');
            if (!uid) return;
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                setUserPlan(data.plan || 'trial');
                // Calculate days left
                if (data.trialStart) {
                    const start = new Date(data.trialStart);
                    const now = new Date();
                    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                    const daysLeft = (data.trialDays || 3) - diff;
                    setTrialDaysLeft(daysLeft > 0 ? daysLeft : 0);
                    setTrialExpired(daysLeft <= 0);
                }
            }
        };
        fetchUserPlan();
    }, [isAuthenticated]);

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

    // Delete package in Firestore
    const confirmDelete = async () => {
        if (deleteId) {
            setLoading(true);
            setError(null);
            try {
                await deleteDoc(doc(db, 'packages', deleteId));
                setToast({ message: 'Package deleted.', type: 'success' });
                setDeleteId(null);
            } catch {
                setError('Could not delete package.');
                setToast({ message: 'Error deleting package.', type: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    const cancelDelete = () => setDeleteId(null);

    // Add or update package in Firestore
    const handleSubmit = async (values: PackageFormValues) => {
        setLoading(true);
        setError(null);
        try {
            if (editId) {
                await updateDoc(doc(db, 'packages', editId), { ...values });
                setToast({ message: 'Package updated.', type: 'success' });
            } else {
                await addDoc(collection(db, 'packages'), {
                    ...values,
                    status: 'pending',
                    activityLog: [{ action: 'Package added', timestamp: new Date().toISOString() }],
                });
                setToast({ message: 'Package added.', type: 'success' });
            }
            setModalOpen(false);
        } catch {
            setError('Could not save package.');
            setToast({ message: 'Error saving package.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Notify or confirm pickup (update status and log in Firestore)
    const handleNotify = async (id: string, confirmPickup?: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const pkgRef = doc(db, 'packages', id);
            const pkgSnap = await getDoc(pkgRef);
            const pkg = pkgSnap.data();
            if (!pkg) throw new Error('Package not found');
            const updates = confirmPickup
                ? {
                    status: 'picked_up',
                    activityLog: [...(pkg.activityLog || []), { action: 'Package picked up', timestamp: new Date().toISOString() }],
                }
                : {
                    status: 'notified',
                    activityLog: [...(pkg.activityLog || []), { action: 'Tenant notified', timestamp: new Date().toISOString() }],
                };
            await updateDoc(pkgRef, updates);
            setToast({ message: confirmPickup ? 'Package marked as picked up!' : 'Tenant notified!', type: 'success' });
        } catch {
            setError('Could not update package.');
            setToast({ message: 'Error updating package.', type: 'error' });
        } finally {
            setLoading(false);
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
        a.download = `package-logs-${new Date().toISOString().slice(0, 10)}.csv`;
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

    // Example: Stripe checkout handler
    const handleUpgrade = async (planId: string) => {
        setToast({ message: `Redirecting to Stripe for ${planId} plan...`, type: 'info' });
        const res = await fetch(`${API_URL}/api/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId, userId: auth.currentUser?.uid || 'demo-user' })
        });
        const { sessionId } = await res.json();
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId });
    };

    // Sign out logic
    const handleSignOut = async () => {
        await signOut(auth);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('uid');
        Cookies.remove('isLoggedIn');
        window.location.href = '/login';
    };

    if (authLoading) return <div className="text-center py-10">Loading...</div>;
    if (!isAuthenticated) return null;
    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <header className="flex items-center gap-3 mb-8 justify-between">
                <div className="flex items-center gap-3">
                    <Image src="/file.svg" alt="Site Logo" width={32} height={32} priority />
                    <span className="text-2xl font-bold tracking-tight">TrackPack</span>
                </div>
                <button
                    className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                    onClick={handleSignOut}
                >
                    Sign Out
                </button>
            </header>
            <nav className="flex flex-wrap gap-2 mb-8 border-b pb-3" role="tablist" aria-label="Dashboard Sections">
                <button
                    className={`px-4 py-2 rounded-t transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeSection === 'packages' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                    onClick={() => setActiveSection('packages')}
                    aria-selected={activeSection === 'packages'}
                    aria-label="Packages Section"
                    role="tab"
                >
                    Packages
                </button>
                <button
                    className={`px-4 py-2 rounded-t transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeSection === 'tenants' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                    onClick={() => setActiveSection('tenants')}
                    aria-selected={activeSection === 'tenants'}
                    aria-label="Tenants Section"
                    role="tab"
                >
                    Tenants
                </button>
                <button
                    className={`px-4 py-2 rounded-t transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeSection === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                    onClick={() => setActiveSection('settings')}
                    aria-selected={activeSection === 'settings'}
                    aria-label="Admin Settings Section"
                    role="tab"
                >
                    Admin Settings
                </button>
                <button
                    className={`px-4 py-2 rounded-t transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeSection === 'pricing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                    onClick={() => setActiveSection('pricing')}
                    aria-selected={activeSection === 'pricing'}
                    aria-label="Pricing & Plans Section"
                    role="tab"
                >
                    Pricing & Plans
                </button>
            </nav>

            {activeSection === 'packages' && (
                <>
                    <DashboardHeader onAdd={handleAdd} />
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            className="border rounded px-3 py-2 flex-1 min-w-0"
                            placeholder="Search by tenant, unit, carrier, tracking ID..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <select
                            className="border rounded px-3 py-2 min-w-[140px]"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="notified">Notified</option>
                            <option value="picked_up">Picked Up</option>
                        </select>
                        <button
                            className="px-4 py-2 rounded bg-blue-600 text-white whitespace-nowrap"
                            onClick={exportCSV}
                        >
                            Export CSV
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-green-600 text-white whitespace-nowrap"
                            onClick={() => {
                                const headers = ['Package', 'Action', 'Timestamp'];
                                const rows = packages.flatMap(pkg =>
                                    (pkg.activityLog || []).map(log => [
                                        `${pkg.tenant} (${pkg.trackingId})`,
                                        log.action,
                                        log.timestamp
                                    ])
                                );
                                const csvContent = [headers, ...rows]
                                    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
                                    .join('\n');
                                const blob = new Blob([csvContent], { type: 'text/csv' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                        >
                            Export Activity Log CSV
                        </button>
                    </div>
                    <PackageTable
                        packages={filteredPackages.filter(pkg => pkg.status !== 'picked_up')}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onNotify={handleNotify}
                    />
                    <div className="mt-10">
                        <h2 className="text-xl font-bold mb-4">Picked Up Packages</h2>
                        <PackageTable
                            packages={filteredPackages.filter(pkg => pkg.status === 'picked_up')}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onNotify={handleNotify}
                        />
                    </div>
                </>
            )}

            {activeSection === 'tenants' && (
                <>
                    <div className="flex justify-end mb-4">
                        <button
                            className="px-4 py-2 rounded bg-blue-600 text-white whitespace-nowrap"
                            onClick={() => {
                                const headers = ['Name', 'Unit', 'Contact'];
                                const rows = tenants.map(t => [t.name, t.unit, t.contact]);
                                const csvContent = [headers, ...rows]
                                    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
                                    .join('\n');
                                const blob = new Blob([csvContent], { type: 'text/csv' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `tenants-${new Date().toISOString().slice(0, 10)}.csv`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                        >
                            Export Tenants CSV
                        </button>
                    </div>
                    <TenantManagement tenants={tenants} setTenants={setTenants} />
                </>
            )}

            {activeSection === 'settings' && (
                <AdminSettings
                    open={true}
                    onClose={() => setActiveSection('packages')}
                    onSave={settings => { setAdminSettings(settings); setToast({ message: 'Settings saved!', type: 'success' }); }}
                    initial={adminSettings}
                    planInfo={{ plan: userPlan, trialDaysLeft, trialExpired }}
                />
            )}

            {activeSection === 'pricing' && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Pricing & Plans</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {PRICING_PLANS.map(plan => (
                            <div key={plan.id} className={`border rounded-lg p-6 flex flex-col items-center ${userPlan === plan.id ? 'border-blue-600' : 'border-gray-200'}`}>
                                <div className="text-lg font-bold mb-2">{plan.name}</div>
                                <div className="text-3xl font-extrabold mb-2">{plan.price === 0 ? 'Free' : `$${plan.price}/mo`}</div>
                                <ul className="mb-4 text-sm text-gray-700">
                                    {plan.features.map(f => <li key={f}>• {f}</li>)}
                                </ul>
                                {plan.id === 'free' && userPlan === 'trial' && !trialExpired && (
                                    <span className="px-4 py-2 rounded bg-yellow-400 text-white mb-2">Trial: {trialDaysLeft} day(s) left</span>
                                )}
                                {plan.id === 'free' && userPlan === 'trial' && trialExpired && (
                                    <span className="px-4 py-2 rounded bg-red-600 text-white mb-2">Trial expired</span>
                                )}
                                {userPlan === plan.id ? (
                                    <span className="px-4 py-2 rounded bg-blue-600 text-white">Current Plan</span>
                                ) : (
                                    <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={() => handleUpgrade(plan.id)}>
                                        {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Package' : 'Add Package'}>
                <PackageForm
                    initialValues={editingPackage}
                    onSubmit={handleSubmit}
                    submitLabel={editId ? 'Update' : 'Add'}
                />
            </Modal>

            <Modal open={!!deleteId} onClose={cancelDelete} title="Confirm Delete">
                <div className="mb-4">Are you sure you want to delete this package?</div>
                <div className="flex gap-3 justify-end">
                    <button className="px-4 py-2 rounded bg-gray-200" onClick={cancelDelete}>Cancel</button>
                    <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={confirmDelete}>Delete</button>
                </div>
            </Modal>
        </div>
    );
};

export default LandlordDashboard;
