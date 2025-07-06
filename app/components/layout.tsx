'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { SignOutButton } from './SignOutButton';

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { cartItems, removeFromCart } = useCart();
    const supabase = createClientComponentClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-black">
            {/* ... existing header code ... */}

            {/* Replace both mobile and desktop Sign Out Links with SignOutButton */}
            <SignOutButton />

            {/* ... rest of the existing code ... */}
        </div>
    );
}
