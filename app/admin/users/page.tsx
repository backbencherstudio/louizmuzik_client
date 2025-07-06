'use client';

import { useState } from 'react';
import {
    Check,
    X,
    Search,
    Trash2,
    Mail,
    Save,
    UserPlus,
    UserMinus,
    Key,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface UserStats {
    totalMelodies: number;
    totalDownloads: number;
    totalPlays: number;
    totalProducts: number;
    productsSold: number;
    totalRevenue: number;
    membershipMonths: number;
    platformCommission: number; // 3% of totalRevenue
}

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Free' | 'Pro';
    joinDate: string;
    lastLogin: string;
    stats: UserStats;
}

// Temporary mock data - This would be replaced with real API data
const mockUsers: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Free',
        joinDate: '2024-01-15',
        lastLogin: '2024-03-20',
        stats: {
            totalMelodies: 12,
            totalDownloads: 45,
            totalPlays: 230,
            totalProducts: 3,
            productsSold: 8,
            totalRevenue: 79.92,
            membershipMonths: 0,
            platformCommission: 2.4, // 3% of 79.92
        },
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Pro',
        joinDate: '2024-02-01',
        lastLogin: '2024-03-21',
        stats: {
            totalMelodies: 28,
            totalDownloads: 156,
            totalPlays: 892,
            totalProducts: 7,
            productsSold: 23,
            totalRevenue: 229.77,
            membershipMonths: 2,
            platformCommission: 6.89, // 3% of 229.77
        },
    },
    // Add more mock users as needed
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [pendingRoleChanges, setPendingRoleChanges] = useState<{
        [key: string]: 'Free' | 'Pro';
    }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [expandedUsers, setExpandedUsers] = useState<{
        [key: string]: boolean;
    }>({});

    const handleRoleChange = (userId: string, checked: boolean) => {
        setPendingRoleChanges((prev) => ({
            ...prev,
            [userId]: checked ? 'Pro' : 'Free',
        }));
    };

    const handleSaveRoleChange = async (userId: string) => {
        const newRole = pendingRoleChanges[userId];
        if (!newRole) return;

        try {
            setLoading({ ...loading, [userId]: true });
            // In a real application, this would make an API call to update the user's role
            // await fetch('/api/admin/users/role', {
            //     method: 'PUT',
            //     body: JSON.stringify({ userId, role: newRole }),
            // });

            setUsers(
                users.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );

            // Clear the pending change after successful save
            const newPendingChanges = { ...pendingRoleChanges };
            delete newPendingChanges[userId];
            setPendingRoleChanges(newPendingChanges);
        } catch (error) {
            console.error('Error changing user role:', error);
            alert('Failed to change user role. Please try again.');
        } finally {
            setLoading({ ...loading, [userId]: false });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (
            !confirm(
                'Are you sure you want to delete this user? This action cannot be undone.'
            )
        ) {
            return;
        }

        try {
            setLoading({ ...loading, [`delete-${userId}`]: true });
            // In a real application, this would make an API call to delete the user
            // await fetch('/api/admin/users/${userId}', {
            //     method: 'DELETE',
            // });

            setUsers(users.filter((user) => user.id !== userId));

            // Clear any pending changes for the deleted user
            if (pendingRoleChanges[userId]) {
                const newPendingChanges = { ...pendingRoleChanges };
                delete newPendingChanges[userId];
                setPendingRoleChanges(newPendingChanges);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        } finally {
            setLoading({ ...loading, [`delete-${userId}`]: false });
        }
    };

    const toggleUserExpanded = (userId: string) => {
        setExpandedUsers((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-4">
                    User Management
                </h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-zinc-400 w-5 h-5" />
                </div>
            </div>

            <div className="bg-zinc-900/50 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Name
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Email
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Role
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Join Date
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Last Login
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <>
                                    <tr
                                        key={user.id}
                                        className="border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                                        onClick={() =>
                                            toggleUserExpanded(user.id)
                                        }
                                    >
                                        <td className="p-4 text-white">
                                            {user.name}
                                        </td>
                                        <td className="p-4 text-white">
                                            {user.email}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={
                                                        pendingRoleChanges[
                                                            user.id
                                                        ]
                                                            ? pendingRoleChanges[
                                                                  user.id
                                                              ] === 'Pro'
                                                            : user.role ===
                                                              'Pro'
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleRoleChange(
                                                            user.id,
                                                            checked
                                                        )
                                                    }
                                                />
                                                <span className="text-zinc-200">
                                                    {pendingRoleChanges[
                                                        user.id
                                                    ] || user.role}
                                                    {pendingRoleChanges[
                                                        user.id
                                                    ] && (
                                                        <span className="ml-2 text-zinc-400">
                                                            (Pending)
                                                        </span>
                                                    )}
                                                </span>
                                                {pendingRoleChanges[
                                                    user.id
                                                ] && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSaveRoleChange(
                                                                user.id
                                                            );
                                                        }}
                                                        className="ml-2 px-3 py-1 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors"
                                                        disabled={
                                                            loading[user.id]
                                                        }
                                                    >
                                                        Save Changes
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-white">
                                            {new Date(
                                                user.joinDate
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-white">
                                            {new Date(
                                                user.lastLogin
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteUser(
                                                            user.id
                                                        );
                                                    }}
                                                    className="text-zinc-400 hover:text-red-500"
                                                    disabled={
                                                        loading[
                                                            `delete-${user.id}`
                                                        ]
                                                    }
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleUserExpanded(
                                                            user.id
                                                        );
                                                    }}
                                                    className="text-zinc-400 hover:text-zinc-200"
                                                >
                                                    {expandedUsers[user.id] ? (
                                                        <ChevronUp size={16} />
                                                    ) : (
                                                        <ChevronDown
                                                            size={16}
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedUsers[user.id] && (
                                        <tr className="bg-zinc-800/30 border-b border-zinc-800">
                                            <td colSpan={6} className="p-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                                                        <h3 className="text-sm font-medium text-zinc-400 mb-1">
                                                            Melodies
                                                        </h3>
                                                        <div className="space-y-2">
                                                            <p className="text-white">
                                                                Total:{' '}
                                                                {
                                                                    user.stats
                                                                        .totalMelodies
                                                                }
                                                            </p>
                                                            <p className="text-white">
                                                                Downloads:{' '}
                                                                {
                                                                    user.stats
                                                                        .totalDownloads
                                                                }
                                                            </p>
                                                            <p className="text-white">
                                                                Plays:{' '}
                                                                {
                                                                    user.stats
                                                                        .totalPlays
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                                                        <h3 className="text-sm font-medium text-zinc-400 mb-1">
                                                            Products
                                                        </h3>
                                                        <div className="space-y-2">
                                                            <p className="text-white">
                                                                Total:{' '}
                                                                {
                                                                    user.stats
                                                                        .totalProducts
                                                                }
                                                            </p>
                                                            <p className="text-white">
                                                                Sold:{' '}
                                                                {
                                                                    user.stats
                                                                        .productsSold
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                                                        <h3 className="text-sm font-medium text-zinc-400 mb-1">
                                                            Revenue
                                                        </h3>
                                                        <div className="space-y-2">
                                                            <p className="text-white">
                                                                Total: $
                                                                {user.stats.totalRevenue.toFixed(
                                                                    2
                                                                )}
                                                            </p>
                                                            <p className="text-zinc-400 text-sm">
                                                                Platform Fee
                                                                (3%): $
                                                                {user.stats.platformCommission.toFixed(
                                                                    2
                                                                )}
                                                            </p>
                                                            <p className="text-emerald-500">
                                                                Net: $
                                                                {(
                                                                    user.stats
                                                                        .totalRevenue -
                                                                    user.stats
                                                                        .platformCommission
                                                                ).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-zinc-800/50 p-4 rounded-lg">
                                                        <h3 className="text-sm font-medium text-zinc-400 mb-1">
                                                            Membership
                                                        </h3>
                                                        <p className="text-white">
                                                            {
                                                                user.stats
                                                                    .membershipMonths
                                                            }{' '}
                                                            months
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
