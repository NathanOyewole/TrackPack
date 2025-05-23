import React, { useState } from 'react';
import TextInput from '../../components/atoms/TextInput';
import SampleButton from '../../components/atoms/SampleButton';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {sent ? (
                <div className="text-blue-600 font-semibold">Check your email for a magic link!</div>
            ) : (
                <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSend}>
                    <TextInput label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
                    <SampleButton label="Send Magic Link" />
                </form>
            )}
        </div>
    );
} 
