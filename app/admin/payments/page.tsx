'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CreditCard,
    Search,
    MoreVertical,
    Package,
    Ban,
    RefreshCcw,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ClientPagination } from '@/components/admin/ClientPagination';
import { useGetBillingHistoryQuery } from '@/app/store/api/adminApis/adminApis';

type PaymentType = 'subscription' | 'marketplace';

interface BillingHistoryItem {
    _id: string;
    userId: string;
    email: string;
    name: string;
    salesAmount: number;
    subscriptionAmount: number;
    commission: number;
    createdAt: string;
    updatedAt: string;
    invoiceURL: string;
    packId?: {
        title: string;
    };
}

interface Payment {
    id: string;
    type: PaymentType;
    amount: number;
    commission?: number;
    user: {
        id: string;
        name: string;
        email: string;
    };
    details: {
        subscriptionId?: string;
        productId?: string;
        productTitle?: string;
        seller?: {
            id: string;
            name: string;
            email: string;
        };
        
    };
    created_at: string;
}

function PaymentsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<PaymentType | ''>('');

    const page = Number(searchParams.get('page')) || 1;
    const limit = 10;

    const { data: billingHistory, isLoading: isBillingHistoryLoading } = useGetBillingHistoryQuery(null);

    const allBillingHistory = billingHistory?.data || [];

    // Transform billing history data to payments format
    const transformBillingHistoryToPayments = (billingData: BillingHistoryItem[]): Payment[] => {
        return billingData.flatMap((item) => {
            const payments: Payment[] = [];
            
            // Add subscription payment if subscriptionAmount > 0
            if (item.subscriptionAmount > 0) {
                payments.push({
                    id: `${item._id}-subscription`,
                    type: 'subscription',
                    amount: item.subscriptionAmount,
                    user: {
                        id: item.userId,
                        name: item.name,
                        email: item.email,
                    },
                    details: {
                        subscriptionId: item._id,
                    },
                    created_at: item.createdAt,
                });
            }
            
            // Add marketplace payment if salesAmount > 0
            if (item.salesAmount > 0) {
                payments.push({
                    id: `${item._id}-marketplace`,
                    type: 'marketplace',
                    amount: item.salesAmount,
                    commission: item.commission,
                    user: {
                        id: item.userId,
                        name: item.name,
                        email: item.email,
                    },
                    details: {
                        productId: item._id,
                        productTitle: item?.packId?.title || 'Sample Pack',
                        seller: {
                            id: item.userId,
                            name: item.name,
                            email: item.email,
                        },
                    },
                    created_at: item.createdAt,
                });
            }
            
            return payments;
        });
    };

    useEffect(() => {
        if (!isBillingHistoryLoading && allBillingHistory.length > 0) {
            const allPayments = transformBillingHistoryToPayments(allBillingHistory);
            
            // Apply filters
            let filteredPayments = allPayments;
            
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                filteredPayments = filteredPayments.filter(
                    (payment) =>
                        payment.user.name.toLowerCase().includes(searchLower) ||
                        payment.user.email.toLowerCase().includes(searchLower) ||
                        (payment.type === 'marketplace' &&
                            payment.details.productTitle
                                ?.toLowerCase()
                                .includes(searchLower))
                );
            }
            
            if (typeFilter) {
                filteredPayments = filteredPayments.filter(
                    (payment) => payment.type === typeFilter
                );
            }
            
            // Apply pagination
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedPayments = filteredPayments.slice(start, end);
            
            setPayments(paginatedPayments);
            setTotal(filteredPayments.length);
            setLoading(false);
        } else if (!isBillingHistoryLoading) {
            setPayments([]);
            setTotal(0);
            setLoading(false);
        }
    }, [allBillingHistory, isBillingHistoryLoading, page, searchTerm, typeFilter]);

    const handlePaymentAction = async (
        paymentId: string,
        action: 'cancel' | 'refund'
    ) => {
        try {
            const response = await fetch('/api/admin/payments', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentId,
                    action,
                }),
            });

            if (response.ok) {
                // Refresh the data by refetching billing history
                window.location.reload();
            } else {
                const data = await response.json();
                console.error('Error updating payment:', data.error);
            }
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (isBillingHistoryLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">
                        Transactions
                    </h2>
                </div>
                <div className="bg-zinc-900 rounded-lg p-8">
                    <div className="text-center text-zinc-400">Loading transactions...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">
                    Transactions
                </h2>
            </div>

            {/* Search and Filters */}
            <div className="bg-zinc-900 p-4 rounded-lg mb-6">
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                            <Search className="w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by user or transaction..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none text-white focus:outline-none w-full"
                            />
                        </div>
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) =>
                            setTypeFilter(e.target.value as PaymentType | '')
                        }
                        className="bg-zinc-800 text-white rounded-lg px-3 py-2 border-none focus:outline-none"
                    >
                        <option value="">All Types</option>
                        <option value="subscription">Subscriptions</option>
                        <option value="marketplace">Marketplace</option>
                    </select>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-zinc-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Transaction
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    User
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Amount
                                </th>
                                <th className="text-left p-4 text-zinc-400 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center p-4 text-zinc-400"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center p-4 text-zinc-400"
                                    >
                                        No payments found
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="border-b border-zinc-800"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                                    {payment.type ===
                                                    'subscription' ? (
                                                        <CreditCard className="w-5 h-5 text-emerald-500" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-emerald-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">
                                                        {payment.type ===
                                                        'subscription'
                                                            ? 'PRO Subscription'
                                                            : payment.details
                                                                  .productTitle}
                                                    </div>
                                                    <div className="text-sm text-zinc-400">
                                                        {new Date(
                                                            payment.created_at
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="text-white">
                                                    {payment.user.name}
                                                </div>
                                                <div className="text-sm text-zinc-400">
                                                    {payment.user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="text-white">
                                                    {formatCurrency(
                                                        payment.amount
                                                    )}
                                                </div>
                                                {payment.commission && (
                                                    <div className="text-sm text-zinc-400">
                                                        Commission:{' '}
                                                        {formatCurrency(
                                                            payment.commission
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-[160px] bg-zinc-900 border-zinc-800"
                                                >
                                                    {payment.type ===
                                                        'subscription' && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handlePaymentAction(
                                                                    payment.id,
                                                                    'cancel'
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-500 hover:bg-zinc-800"
                                                        >
                                                            <Ban className="w-4 h-4 mr-2" />
                                                            Cancel Sub
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handlePaymentAction(
                                                                payment.id,
                                                                'refund'
                                                            )
                                                        }
                                                        className="text-orange-500 hover:text-orange-500 hover:bg-zinc-800"
                                                    >
                                                        <RefreshCcw className="w-4 h-4 mr-2" />
                                                        Refund
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <ClientPagination total={total} />
        </div>
    );
}

export default PaymentsPage;
