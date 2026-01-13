'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Book, ShoppingBag, Search as SearchIcon } from 'lucide-react';
import { useCurrency } from '@/providers/CurrencyProvider';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

import { Suspense } from 'react';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { formatPrice } = useCurrency();

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error('Search failed');
            return res.json();
        },
        enabled: !!query,
    });

    return (
        <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
            <div className="max-w-7xl mx-auto px-6">
                <header className="pt-32 pb-16">
                    <div className="flex items-center justify-between mb-12">
                        <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all font-medium text-sm">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Explorer</span>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in">
                        <div>
                            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-bold mb-4">
                                <SearchIcon className="w-5 h-5" />
                                <span className="tracking-widest uppercase text-sm">Search Results</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black">
                                Results for <span className="gradient-text">"{query}"</span>
                            </h1>
                        </div>
                        <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <span className="text-slate-500 font-medium">Found:</span>
                            <span className="ml-2 font-bold text-indigo-600 dark:text-indigo-400">{products?.length || 0} books</span>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : products?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product: any, idx: number) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 card-hover shadow-sm animate-fade-in"
                                style={{ animationDelay: `${idx * 0.03}s` }}
                            >
                                <div className="aspect-[3/4.5] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Book className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <ShoppingBag className="w-4 h-4" />
                                            Explore Item
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="font-bold text-lg line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors leading-snug">
                                        {product.title}
                                    </h3>
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                        <span className="font-black text-xl text-indigo-600 dark:text-indigo-400">
                                            {formatPrice(product.price, product.currency)}
                                        </span>
                                        <span className="text-xs font-bold px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-500 uppercase">
                                            Pre-Owned
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-200/50 dark:border-slate-800/50">
                        <div className="text-6xl mb-6">🔍</div>
                        <h2 className="text-2xl font-bold mb-2">No results found</h2>
                        <p className="text-slate-500 mb-8">Try a different keyword or browse our categories.</p>
                        <Link href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium text-lg">Searching library...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
