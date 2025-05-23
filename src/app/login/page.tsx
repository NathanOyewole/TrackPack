"use client";

import React, { useState } from 'react';
import TextInput from '../../components/atoms/TextInput';
import SampleButton from '../../components/atoms/SampleButton';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email.');
            return;
        }
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSend}>
                <TextInput label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
                {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
                <SampleButton label="Login" />
            </form>
        </div>
    );
}
