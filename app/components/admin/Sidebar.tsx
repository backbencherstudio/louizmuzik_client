'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Music2,
    Package,
    Settings,
    LogOut,
    Bell,
    FileText,
    Tags,
    Filter,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { createClient } from '@/lib/supabase/server';

const menuItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: Tags,
    },
    {
        title: 'Filters',
        href: '/admin/filters',
        icon: Filter,
    },
    {
        title: 'Melodies',
        href: '/admin/melodies',
        icon: Music2,
    },
    {
        title: 'Sample Packs',
        href: '/admin/packs',
        icon: Package,
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: FileText,
    },
    {
        title: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        const supabaseClient = await supabase;
        await supabaseClient.auth.signOut();
        router.push('/');
        router.refresh();
    };


    return (
        <div className="flex h-screen flex-col justify-between border-r border-zinc-800 bg-zinc-950 w-64 fixed left-0 top-0">
            <div className="px-4 py-6">
                <Link
                    href="/admin"
                    className="flex items-center gap-2 px-2 mb-8"
                >
                    <span className="text-xl font-bold text-emerald-500">
                        MelodyCollab
                    </span>
                </Link>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-white',
                                    isActive &&
                                        'bg-zinc-900 text-emerald-500 font-medium'
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t border-zinc-800 p-4">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-white hover:bg-zinc-900"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
