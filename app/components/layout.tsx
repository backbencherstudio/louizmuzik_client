'use client';

import { createClient } from '@/lib/supabase/server';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/components/cart-context';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { SignOutButton } from './SignOutButton';

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { cartItems, removeFromCart } = useCart();
    const supabase = createClient();

   
    return (
        <div className="min-h-screen bg-black">
            {/* ... existing header code ... */}

            {/* Replace both mobile and desktop Sign Out Links with SignOutButton */}
            <SignOutButton />

            {/* ... rest of the existing code ... */}
        </div>
    );
}
