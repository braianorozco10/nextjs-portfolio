'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession /*, clearSession */ } from '@/lib/auth';
import ToolCard from '@/components/ToolCard';

export default function WorkToolsPage() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace('/login');
      return;
    }
    setUsername(s.username);
  }, [router]);

  if (!username) return null;

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Work tools</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard
            title="Time Converter"
            description="Convert HHh MMm to decimal and export."
            href="/work-tools/time-converter"
          />
        </div>
      </div>
    </main>
  );
}