'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, Circle, Layers } from 'lucide-react';

export default function SOPPage(): React.JSX.Element {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState(1);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const markSectionComplete = (stepIds: string[]) => {
    setCompletedSteps((prev) => {
      const next = { ...prev };
      // Check if all are currently complete, if so, uncheck them. Otherwise, check them all.
      const allComplete = stepIds.every((id) => next[id]);
      stepIds.forEach((id) => {
        next[id] = !allComplete;
      });
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center space-x-3 text-indigo-600 font-bold text-xl border-b border-gray-100">
          <Layers className="w-6 h-6" />
          <span>SOP Flow</span>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 mb-4 tracking-wider uppercase">Navigation</p>
          <nav className="space-y-2">
            {[
              { id: 1, label: 'Preparation' },
              { id: 2, label: 'Execution' },
              { id: 3, label: 'Completion' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg shadow-sm transition-colors ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50 bg-white border border-gray-100'
                  }`}
              >
                <span className="font-medium">{tab.id}. {tab.label}</span>
                <span className={`${activeTab === tab.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-500'
                  } text-xs px-2 py-1 rounded-full`}>
                  {tab.id}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              OpenTable Check SOP
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl">
              Things to check for before contacting dev..
            </p>
            <p className="text-sm text-gray-400 mt-2">Last Updated: May 2026</p>
          </motion.div>

          {/* Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12 flex gap-6 flex-col lg:flex-row"
          >
            <div className="flex-1 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl aspect-video flex items-center justify-center shadow-inner relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="bg-white/90 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform z-10">
                <Play className="w-8 h-8 text-indigo-600 ml-1" />
              </div>
              <p className="absolute bottom-6 font-medium text-white shadow-sm z-10">Process Overview Video</p>
            </div>

            <div className="lg:w-64 flex flex-col justify-center space-y-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div>
                <p className="text-sm text-gray-500 mb-1">Duration</p>
                <p className="font-semibold text-gray-900">3:45 mins</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Speaker</p>
                <p className="font-semibold text-gray-900">Braian Orozco</p>
              </div>
            </div>
          </motion.div>

          {/* Procedure Steps */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Procedure Steps</h2>

            <div className="grid gap-6">
              {/* Step 1 Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-indigo-600 font-semibold text-sm">Step 1:</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">Setup Workspace</h3>
                  </div>
                  <button
                    onClick={() => markSectionComplete(['1-1', '1-2', '1-3', '1-4'])}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {['1-1', '1-2', '1-3', '1-4'].every(id => completedSteps[id]) ? 'Unmark All' : 'Mark Complete'}
                  </button>
                </div>

                <div className="space-y-3 mt-6">
                  {([
                    { id: '1-1', text: 'Log into Urvenue', href: 'https://urvenue.me' },
                    { id: '1-2', text: 'Open our POC', href: 'https://api.urvenue.me/ot/experiences.php?rid=101227' },
                    { id: '1-3', text: 'Locate the venues RID' },
                    { id: '1-4', text: 'Log into OpenTables Guestcenter', href: 'https://guestcenter.opentable.com/login' },
                  ] as { id: string; text: string; href?: string }[]).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleStep(item.id)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      {completedSteps[item.id] ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                      )}
                      <span className={`${completedSteps[item.id] ? 'text-gray-500 line-through' : 'text-gray-700'} transition-all select-none`}>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 transition-colors underline decoration-indigo-300 underline-offset-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.text}
                          </a>
                        ) : (
                          item.text
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Step 2 Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow opacity-80"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-gray-500 font-semibold text-sm">Step 2:</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">Make sure the venue is linked to OpenTable</h3>
                  </div>
                  <button
                    onClick={() => markSectionComplete(['2-1', '2-2', '2-3'])}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {['2-1', '2-2', '2-3'].every(id => completedSteps[id]) ? 'Unmark All' : 'Mark Complete'}
                  </button>
                </div>

                <div className="space-y-3 mt-6">
                  {([
                    { id: '2-1', text: 'Go into Knowledge Base' },
                    { id: '2-2', text: 'Click on Admin' },
                    { id: '2-3', text: 'Go to Uv Core' },
                    { id: '2-4', text: 'Click on the i in the OpenTable rectagle' },
                    { id: '2-5', text: 'Follow those esteps to link the venue' },
                  ] as { id: string; text: string; href?: string }[]).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleStep(item.id)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      {completedSteps[item.id] ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                      )}
                      <span className={`${completedSteps[item.id] ? 'text-gray-500 line-through' : 'text-gray-700'} transition-all select-none`}>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 transition-colors underline decoration-indigo-300 underline-offset-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.text}
                          </a>
                        ) : (
                          item.text
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Step 3 Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow opacity-80"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-gray-500 font-semibold text-sm">Step 3:</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">Availability</h3>
                  </div>
                  <button
                    onClick={() => markSectionComplete(['3-1', '3-2', '3-3', '3-4', '3-5', '3-6'])}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {['3-1', '3-2', '3-3', '3-4', '3-5', '3-6'].every(id => completedSteps[id]) ? 'Unmark All' : 'Mark Complete'}
                  </button>
                </div>

                <div className="space-y-3 mt-6">
                  {([
                    { id: '3-1', text: "If regular item: go to OpenTable's back end review item availability in their calendar." },
                    { id: '3-2', text: 'If experience: open the POC' },
                    { id: '3-3', text: 'Select the correct RID' },
                    { id: '3-4', text: 'Open Urvenue inventory' },
                    { id: '3-5', text: 'Master item' },
                    { id: '3-6', text: 'Check if the item information matches the POC.' },
                  ] as { id: string; text: string; href?: string }[]).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleStep(item.id)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      {completedSteps[item.id] ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                      )}
                      <span className={`${completedSteps[item.id] ? 'text-gray-500 line-through' : 'text-gray-700'} transition-all select-none`}>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 transition-colors underline decoration-indigo-300 underline-offset-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.text}
                          </a>
                        ) : (
                          item.text
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
              {/* end of card 3 */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
