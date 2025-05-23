"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandlordDashboard from '../components/organisms/LandlordDashboard';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') !== 'true') {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <LandlordDashboard />
    </main>
  );
}
