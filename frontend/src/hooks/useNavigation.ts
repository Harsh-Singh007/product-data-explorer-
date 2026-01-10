import { useQuery } from '@tanstack/react-query';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export function useNavigation() {
    return useQuery({
        queryKey: ['navigation'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/navigation`);
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || res.statusText);
            }
            const data = await res.json();

            // Frontend Fallback: If backend returns empty, provide defaults immediately
            if (!data || (Array.isArray(data) && data.length === 0)) {
                return [
                    { id: 1, title: 'Best Sellers', slug: 'best-sellers' },
                    { id: 2, title: 'Fiction', slug: 'fiction-books' },
                    { id: 3, title: 'Non-Fiction', slug: 'non-fiction-books' },
                    { id: 4, title: 'Children\'s Books', slug: 'childrens-books' },
                    { id: 5, title: 'Science Fiction', slug: 'science-fiction-and-fantasy-books' },
                    { id: 6, title: 'History', slug: 'history-books' },
                ];
            }
            return data;
        },
    });
}
