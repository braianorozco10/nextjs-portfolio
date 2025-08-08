'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

type Project = {
  title: string;
  description: string;
  link?: string;
  image?: string;
};

const projects: Project[] = [
  {
    title: 'Personal Portfolio',
    image: '/assets/braianpf.png',
    description: 'My own site built with Next.js, TypeScript, and Tailwind CSS.',
    link: 'https://your-portfolio-link.com',
  },
  {
    title: 'PM for RW Las Vegas Website',
    image: '/assets/rwlv.png',
    description: 'A booking tool made for resort and hotel clients.',
    link: 'https://rwlasvegas.com',
  },
  {
    title: 'PM for EEG Website',
    image: '/assets/eeg.png',
    description: 'An internal tool for scheduling and tracking campaigns.',
    link: 'https://eveningentertainmentgroup.com/',
  },
];

export default function ProjectsPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4 py-10">
      <div className="max-w-7xl w-full">
        <motion.h1
          className="text-4xl font-bold text-[#1f2937] mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Projects
        </motion.h1>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.2, duration: 0.5 }}
              className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              {project.image && (
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                </a>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#1f2937]">
                  {project.title}
                </h2>
                <p className="text-gray-600 mt-2">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-indigo-600 hover:underline font-medium"
                  >
                    View Project →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
