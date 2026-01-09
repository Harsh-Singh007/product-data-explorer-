'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import CurrencyToggle from './CurrencyToggle';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Explorer', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'README', href: '/readme' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
                ? 'py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm'
                : 'py-6 bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                        <Book className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">BookExplorer.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-bold transition-colors ${pathname === link.href
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
                    <CurrencyToggle />
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600 dark:text-slate-400"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300 md:hidden">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-lg font-bold ${pathname === link.href
                                    ? 'text-indigo-600'
                                    : 'text-slate-600 dark:text-slate-400'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Currency</span>
                        <CurrencyToggle />
                    </div>
                </div>
            )}
        </nav>
    );
}
