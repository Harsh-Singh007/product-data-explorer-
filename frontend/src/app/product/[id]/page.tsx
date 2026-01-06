'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

    if (isLoading) return <div className="min-h-screen flex items-center justify-center animate-pulse">Loading product...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading product</div>;

    return (
        <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-6xl mx-auto">
                <Link href="/" className="text-blue-500 hover:text-blue-600 mb-8 inline-block">
                    ← Back to Home
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm">
                    {/* Image Section */}
                    <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden relative shadow-lg">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-6">{product.title}</h1>
                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                                {product.currency || '£'} {product.price}
                            </span>
                            {product.sourceUrl && (
                                <a
                                    href={product.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    View on WOB
                                </a>
                            )}
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-semibold mb-3">Description</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                {product.detail?.description || 'No description available for this item.'}
                            </p>

                            {product.detail?.specs && Object.keys(product.detail.specs).length > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                        {Object.entries(product.detail.specs).map(([key, value]) => (
                                            <div key={key} className="flex justify-between sm:block">
                                                <dt className="text-sm text-gray-500 dark:text-gray-500 capitalize">{key.replace(/_/g, ' ')}</dt>
                                                <dd className="font-medium">{String(value)}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
