'use client';

import { useNavigation } from '@/hooks/useNavigation';
import Link from 'next/link';

export default function Home() {
  const { data: navigation, isLoading, error } = useNavigation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-lg animate-pulse">Loading navigation...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading navigation. Is the backend running?</div>;

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-16 text-center pt-8">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
          World of Books Explorer
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover your next read from millions of pre-loved books, scraped in real-time.
        </p>
      </header>

      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 border-b pb-2 border-gray-200 dark:border-gray-800">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigation?.map((item: any) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              className="group block p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-blue-500/50"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <span className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all text-blue-500">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
