'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Send, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <header className="pt-32 pb-8 flex items-center justify-between">
                    <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all font-medium text-sm">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Explorer</span>
                    </Link>
                </header>

                <section className="mt-12 animate-fade-in text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                        Get in <span className="gradient-text">Touch.</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16 font-medium">
                        Have questions about the platform or want to collaborate? Our team is always ready to talk books and tech.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
                        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-transform hover:-translate-y-1">
                            <Mail className="w-8 h-8 text-indigo-500 mb-6" />
                            <h3 className="font-bold mb-2">Email</h3>
                            <p className="text-slate-500 text-sm">hello@bookexplorer.ai</p>
                        </div>

                        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-transform hover:-translate-y-1">
                            <MessageSquare className="w-8 h-8 text-purple-500 mb-6" />
                            <h3 className="font-bold mb-2">Support</h3>
                            <p className="text-slate-500 text-sm">Help Center & Docs</p>
                        </div>

                        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-transform hover:-translate-y-1">
                            <MapPin className="w-8 h-8 text-pink-500 mb-6" />
                            <h3 className="font-bold mb-2">Office</h3>
                            <p className="text-slate-500 text-sm">Gurgaon, India</p>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"></div>

                        <form className="relative z-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 ml-4 uppercase tracking-widest">Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 ml-4 uppercase tracking-widest">Email</label>
                                    <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 ml-4 uppercase tracking-widest">Message</label>
                                <textarea rows={4} placeholder="How can we help?" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium resize-none"></textarea>
                            </div>
                            <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-3">
                                Send Message
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}
