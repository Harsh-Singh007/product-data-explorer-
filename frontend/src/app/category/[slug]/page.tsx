'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function useCategory(slug: string) {
    return useQuery({
        queryKey: ['category', slug],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/categories/${slug}`);
            if (!res.ok) throw new Error('Failed to fetch category');
            return res.json();
        },
        enabled: !!slug,
    });
}

export default function CategoryPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const { data, isLoading, error } = useCategory(slug);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center animate-pulse">Loading category...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading category</div>;

    const { category, products } = data || {};

    return (
        <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <Link href="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold">{category?.title || slug}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Found {products?.length || 0} books
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products?.map((product: any) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                        >
                            <div className="aspect-[2/3] bg-gray-200 relative overflow-hidden">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                    {product.title}
                                </h3>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                                        {product.currency || '£'} {product.price}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
