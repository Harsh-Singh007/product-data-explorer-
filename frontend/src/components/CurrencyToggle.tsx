'use client';

import { useCurrency } from '@/providers/CurrencyProvider';
import { Globe } from 'lucide-react';

export default function CurrencyToggle() {
    const { currency, setCurrency } = useCurrency();

    return (
        <div className="inline-flex bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
            <button
                onClick={() => setCurrency('GBP')}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${currency === 'GBP'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
            >
                GBP £
            </button>
            <button
                onClick={() => setCurrency('INR')}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${currency === 'INR'
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
            >
                INR ₹
            </button>
        </div>
    );
}
