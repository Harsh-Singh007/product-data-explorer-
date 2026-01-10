import { useQuery } from '@tanstack/react-query';
import { FALLBACK_NAVIGATION_DATA } from '../data/fallback';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export function useNavigation() {
    return useQuery({
        queryKey: ['navigation'],
        queryFn: async () => {
            // Cache-busting to ensure we don't get stale "empty" responses
            const res = await fetch(`${API_URL}/navigation?t=${Date.now()}`);
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || res.statusText);
            }
            const data = await res.json();

            // Ultimate Fail-Safe: If backend is empty, use local real-data fallback
            if (!data || (Array.isArray(data) && data.length === 0)) {
                console.warn('Backend returned empty. Using frontend fallback.');
                return FALLBACK_NAVIGATION_DATA;
            }
            return data;
        },
    });
}
