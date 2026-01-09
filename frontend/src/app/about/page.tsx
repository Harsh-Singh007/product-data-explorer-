'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Users, Target, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <header className="pt-32 pb-8 flex items-center justify-between">
                    <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all font-medium text-sm">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Explorer</span>
                    </Link>
                </header>

                <section className="mt-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8">
                        <Book className="w-4 h-4" />
                        <span>Our Story</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter leading-[0.9]">
                        Bridging Books and <br />
                        <span className="gradient-text">Modern Tech.</span>
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-12 font-medium">
                            Product Data Explorer was born from a simple idea: making the vast world of pre-loved books more accessible through cutting-edge automation and AI-driven data extraction.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Target className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                                <p className="text-slate-500 font-medium">To provide a seamless, real-time window into secondary book markets, enabling collectors and readers to find treasures effortlessly.</p>
                            </div>

                            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Community Focused</h3>
                                <p className="text-slate-500 font-medium">We believe in the circular economy. Every book redirected to a new home is a win for the planet and the reader.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            Under the hood, we use a sophisticated orchestration of NestJS backends and Playwright-powered workers. When you browse a category, our agents navigate the World of Books digital library, extracting real-time availability, pricing, and specific product details.
                        </p>

                        <div className="flex items-center gap-4 p-6 bg-indigo-600 rounded-[2rem] text-white">
                            <ShieldCheck className="w-8 h-8 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold">Data Integrity</h4>
                                <p className="text-indigo-100 text-sm">Every piece of information is cross-verified for accuracy before being presented in our boutique interface.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
