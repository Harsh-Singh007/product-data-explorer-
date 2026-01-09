'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'GBP' | 'INR';

interface CurrencyContextType {
    currency: Currency;
    exchangeRate: number; // 1 GBP to INR
    setCurrency: (c: Currency) => void;
    formatPrice: (price: string | number, sourceCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('GBP');
    const [exchangeRate, setExchangeRate] = useState(111.45); // Approximate rate

    const convertPrice = (price: number, source: string) => {
        if (source === 'GBP' && currency === 'INR') {
            return price * exchangeRate;
        }
        if (source === 'INR' && currency === 'GBP') {
            return price / exchangeRate;
        }
        return price;
    };

    const formatPrice = (price: string | number, sourceCurrency: string = 'GBP') => {
        const num = parseFloat(String(price));
        if (isNaN(num)) return currency === 'INR' ? '₹0.00' : '£0.00';

        const converted = convertPrice(num, sourceCurrency);

        if (currency === 'INR') {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(converted);
        }

        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, exchangeRate, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
