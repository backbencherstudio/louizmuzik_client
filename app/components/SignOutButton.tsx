'use client';

import { createClient } from '@/lib/supabase/server';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function SignOutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        const supabaseClient = await supabase;
        await supabaseClient.auth.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <DropdownMenuItem
            className="hover:bg-transparent focus:bg-transparent"
            onClick={handleSignOut}
        >
            <div className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
            </div>
        </DropdownMenuItem>
    );
}
