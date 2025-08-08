'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-6 overflow-hidden">
      {/* Background accent circle */}
      <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-40 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl w-full bg-white shadow-xl rounded-xl border border-gray-200 p-10"
      >
        <motion.h1
          className="text-4xl font-bold text-[#1f2937] mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          About Me
        </motion.h1>

        <motion.p
          className="text-gray-700 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          I'm <span className="font-semibold text-indigo-600">Braian Orozco</span>,
          a passionate web developer and technical project manager with experience
          in building and managing high-quality digital products. I specialize in
          frontend technologies like <span className="font-medium">Next.js</span>,
          <span className="font-medium"> TypeScript</span>, and 
          <span className="font-medium"> Tailwind CSS</span>, with a focus on 
          clean code and excellent user experiences.
        </motion.p>

        <motion.p
          className="text-gray-600 text-md mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          I’ve worked with clients across hospitality, nightlife, and marketing sectors — 
          helping them launch websites, dashboards, and automation tools that drive impact.
          Outside of tech, I’m curious, detail-oriented, and love to explore new creative tools.
        </motion.p>
      </motion.div>
    </main>
  );
}

