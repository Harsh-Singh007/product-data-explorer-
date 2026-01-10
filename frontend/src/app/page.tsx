'use client';

import { useNavigation } from '@/hooks/useNavigation';
import Link from 'next/link';
import { BookOpen, Sparkles, TrendingUp, Search, Globe } from 'lucide-react';
import CurrencyToggle from '@/components/CurrencyToggle';

export default function Home() {
  const { data: navigation, isLoading, error } = useNavigation();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse text-lg">Curating your library...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/30 max-w-md">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Connection Error</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
          We couldn't reach the library shelves. <br />
          <span className="text-sm font-mono bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : String(error)} <br />
            (Target: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'})
          </span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all font-semibold"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none -z-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-50 pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 pointer-events-none -z-10"></div>

        <div className="container mx-auto px-6 text-center animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            Discover Your Next <br />
            <span className="gradient-text">Great Adventure.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            Explore millions of pre-loved books from World of Books,
            scraped instantly with the power of modern tech.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
            <div className="relative flex items-center glass p-2 rounded-full shadow-2xl">
              <div className="pl-6 pr-4">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search collection..."
                className="w-full bg-transparent border-none outline-none py-4 text-lg font-medium"
              />
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all shadow-lg active:scale-95">
                Explore
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Browse Categories</h2>
            <p className="text-slate-500 font-medium">Handpicked collections for every mood</p>
          </div>
          <div className="hidden md:flex gap-2">
            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {navigation?.map((item: any, idx: number) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 card-hover border border-slate-200/50 dark:border-slate-800/50 animate-fade-in`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>

              <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-8 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <span>View Details</span>
                  <div className="w-6 h-0.5 bg-indigo-600 dark:bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  <span className="transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
