'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#f9fafb] flex items-center justify-center relative px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-40 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-3xl w-full bg-white rounded-xl shadow-2xl p-10 border border-gray-200 text-center"
      >
        {/* Animated image */}
        <motion.img
          src="https://ui-avatars.com/api/?name=Braian+Orozco"
          alt="Braian Orozco"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 100 }}
          className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-500 shadow-md mb-6 object-cover"
        />

        <motion.h1
          className="text-5xl font-bold text-[#1f2937] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Hi, I'm <span className="text-indigo-600">Braian Orozco</span>
        </motion.h1>

        <motion.p
          className="text-lg text-gray-700 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Web & Project Developer building clean, scalable applications.
        </motion.p>

        <motion.p
          className="text-md text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          This portfolio showcases my work with Next.js, TypeScript, and other modern tools — especially in the hospitality and marketing sectors.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <Link
            href="/projects"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-500 transition shadow"
          >
            View My Work →
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
