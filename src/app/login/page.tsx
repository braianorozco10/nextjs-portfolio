'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateUser, saveSession } from '@/lib/auth';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const role = validateUser(username.trim(), password);
    if (!role) {
      setError('Invalid username or password');
      return;
    }
    saveSession(role, username.trim());
    router.push('/work-tools');
  }

  return (
    <main className="min-h-screen bg-[#0f1115] flex items-center justify-center relative px-6 overflow-hidden">
      {/* Background accent circles like home page */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-40 z-0" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-3xl opacity-30 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-md w-full bg-white rounded-xl shadow-2xl p-10 border border-gray-200 text-center"
      >
        <motion.h1
          className="text-3xl font-bold text-[#1f2937] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome Back
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-500 transition shadow"
          >
            Login
          </button>
        </form>

      
      </motion.div>
    </main>
  );
}