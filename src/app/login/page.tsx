"use client";

import React, { useState } from 'react';
import TextInput from '../../components/atoms/TextInput';
import SampleButton from '../../components/atoms/SampleButton';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        try {
            let userCredential;
            if (isSignup) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // On signup, create user doc in Firestore with trial info
                const userRef = doc(db, 'users', userCredential.user.uid);
                await setDoc(userRef, {
                    email,
                    plan: 'trial',
                    trialStart: new Date().toISOString(),
                    trialDays: 3
                });
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                // On login, check if user doc exists, if not, create it (for legacy users)
                const userRef = doc(db, 'users', userCredential.user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        email,
                        plan: 'trial',
                        trialStart: new Date().toISOString(),
                        trialDays: 3
                    });
                }
            }
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('uid', auth.currentUser?.uid || '');
            Cookies.set('isLoggedIn', 'true', { expires: 7 });
            router.push('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Authentication failed.');
            } else {
                setError('Authentication failed.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Login'}</h1>
            <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleAuth}>
                <TextInput label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
                <TextInput label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
                {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
                <SampleButton label={isSignup ? 'Sign Up' : 'Login'} />
            </form>
            <button className="mt-4 text-blue-600 underline" onClick={() => setIsSignup(s => !s)}>
                {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
        </div>
    );
}
