import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useNavigation() {
    return useQuery({
        queryKey: ['navigation'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/navigation`);
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || res.statusText);
            }
            return res.json();
        },
    });
}
