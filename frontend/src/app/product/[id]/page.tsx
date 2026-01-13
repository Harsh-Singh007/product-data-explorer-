'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCurrency } from '@/providers/CurrencyProvider';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/products/${id}`);
            if (!res.ok) throw new Error('Failed to fetch product');
            return res.json();
        },
        enabled: !!id,
    });
}

export default function ProductPage() {
    const params = useParams();
    const id = params?.id as string;
    const { data: product, isLoading, error } = useProduct(id);
    const { formatPrice } = useCurrency();

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Retrieving item details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-red-100 dark:border-red-900/30">
                <div className="text-5xl mb-6">🔍</div>
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <Link href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all">
                    Return to Catalog
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <header className="pt-32 pb-8 flex items-center justify-between">
                    <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all font-medium text-sm">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Explorer</span>
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Product Image */}
                    <div className="sticky top-8">
                        <div className="aspect-[3/4.5] bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/50 p-4">
                            <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        No Image Available
                                    </div>
                                )}
                                <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200/50 dark:border-white/10 shadow-xl">
                                    Quality Verified
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right: Product Info */}
                    <div className="animate-fade-in stagger-1">
                        <nav className="flex gap-2 mb-6">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
                                Rare Find
                            </span>
                            <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider border border-green-500/20">
                                In Stock
                            </span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-8 mb-12">
                            <div className="flex flex-col">
                                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Our Price</span>
                                <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                                    {formatPrice(product.price, product.currency)}
                                </span>
                            </div>
                            <div className="h-12 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                            <div className="flex flex-col">
                                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Condition</span>
                                <span className="text-xl font-bold text-slate-700 dark:text-slate-200">Excellent</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <a
                                href={product.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-center transition-all shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Purchase on WOB
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30">
                                <ShieldCheck className="w-6 h-6 text-indigo-500" />
                                <span className="text-sm font-bold">Secure Transaction</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                <span className="text-sm font-bold">Quality Guaranteed</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-xl font-black">Description</h3>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm font-medium">
                                {product.detail?.description || 'This treasure is waiting for its next reader. A detailed summary will be available shortly.'}
                            </p>
                        </div>

                        {/* Specs */}
                        {product.detail?.specs && Object.keys(product.detail.specs).length > 0 && (
                            <div>
                                <h3 className="text-xl font-black mb-6">Technical Specifications</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {Object.entries(product.detail.specs).map(([key, value]) => (
                                        <div key={key} className="flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transform transition-transform hover:scale-[1.02]">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                                                {key.replace(/_/g, ' ')}
                                            </span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 break-words">
                                                {String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
