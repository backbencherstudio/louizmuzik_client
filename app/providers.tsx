'use client';

import { CartProvider } from '@/components/cart-context';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Cualquier configuración del lado del cliente puede ir aquí
        // Esto se ejecutará solo en el navegador
    }, []);

    return <CartProvider>{children}</CartProvider>;
}
