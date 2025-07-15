'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Users,
    Music2,
    Package,
    CreditCard,
    Filter,
    LayoutDashboard,
} from 'lucide-react';
import ProtectedRoute from '@/Private/ProtectedRoute';

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
}

function SidebarItem({ href, icon, label, isActive }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
        >
            {icon}
            {label}
        </Link>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const sidebarItems = [
        {
            href: '/admin',
            icon: <LayoutDashboard className="w-5 h-5" />,
            label: 'Overview',
        },
        {
            href: '/admin/users',
            icon: <Users className="w-5 h-5" />,
            label: 'User Management',
        },
        {
            href: '/admin/melodies',
            icon: <Music2 className="w-5 h-5" />,
            label: 'Melody Management',
        },
        {
            href: '/admin/sample-packs',
            icon: <Package className="w-5 h-5" />,
            label: 'Sample Pack Management',
        },
        {
            href: '/admin/payments',
            icon: <CreditCard className="w-5 h-5" />,
            label: 'Transactions',
        },
        {
            href: '/admin/categories',
            icon: <Filter className="w-5 h-5" />,
            label: 'Categories',
        },
    ];

    return (
        <div className="flex h-screen bg-zinc-950">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 p-4">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-white">
                        Admin Panel
                    </h1>
                </div>
                <nav className="space-y-1">
                    {sidebarItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={pathname === item.href}
                        />
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <ProtectedRoute role="admin">{children}</ProtectedRoute>
            </main>
        </div>
    );
}
