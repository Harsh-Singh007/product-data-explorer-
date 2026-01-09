'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Terminal, Server } from 'lucide-react';

export default function ReadmePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <header className="pt-32 pb-8 flex items-center justify-between">
                    <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all font-medium text-sm">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Explorer</span>
                    </Link>
                </header>

                <section className="mt-12 animate-fade-in shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl rotate-3">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">Project Documentation</h1>
                            <p className="text-slate-500 font-medium">Technical overview and architecture</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Server className="w-6 h-6 text-indigo-500" />
                                Architecture
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <li className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl list-none">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                    <span className="font-bold">Frontend:</span> Next.js (App Router), Tailwind
                                </li>
                                <li className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl list-none">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    <span className="font-bold">Backend:</span> NestJS, TypeScript
                                </li>
                                <li className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl list-none">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                                    <span className="font-bold">Scraping:</span> Playwright (Headless)
                                </li>
                                <li className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl list-none">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span className="font-bold">Database:</span> SQLite (Local)
                                </li>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Terminal className="w-6 h-6 text-indigo-500" />
                                Getting Started
                            </h2>
                            <div className="space-y-6">
                                <div className="bg-slate-900 rounded-3xl p-8 overflow-x-auto text-indigo-300 font-mono text-sm border border-white/10 shadow-inner">
                                    <p className="text-white font-bold mb-4"># Backend Setup</p>
                                    <p>cd backend</p>
                                    <p>npm install</p>
                                    <p>npm run start:dev <span className="text-slate-500"># Runs at :3000</span></p>

                                    <p className="text-white font-bold mt-8 mb-4"># Frontend Setup</p>
                                    <p>cd frontend</p>
                                    <p>npm install</p>
                                    <p>npm run dev <span className="text-slate-500"># Runs at :3001</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100 dark:border-indigo-500/20">
                            <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Environment Variables</h3>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">The system relies on specific environment configurations. Ensure <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg">.env</code> files are correctly set based on the provided <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg">.env.example</code> templates in both directories.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
