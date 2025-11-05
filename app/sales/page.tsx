'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, Search } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import Layout from '@/components/layout';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Copy, FileText, ArrowDownToLine } from 'lucide-react';
import Image from 'next/image';
import { useGetSalesHistoryQuery } from '../store/api/paymentApis/paymentApis';
import { Pagination } from '@/components/ui/pagination';
import { useProRoute } from '@/hooks/useProRoute';


interface PackData {
    _id: string;
    price: number;
    title: string;
}

interface UserData {
    _id: string;
    email: string;
    name: string;
}

interface SalesTransaction {
    _id: string;
    createdAt: string;
    updatedAt: string;
    price: number;
    selectedProducerId: string;
    packId: PackData;
    userId: UserData;
}

interface TransformedSalesData {
    id: string;
    date: string;
    buyer: string;
    buyerEmail: string;
    product: string;
    amount: number;
    producerId: string;
    packId: string;
    updatedAt: string;
}

interface SalesHistoryResponse {
    data: SalesTransaction[];
    success: boolean;
    message?: string;
}

export default function SalesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransformedSalesData | null>(null);

    const { isAuthorized, isLoading: isLoadingUser, userId } = useProRoute();

    const { data: salesHistory, isLoading: isLoadingSalesHistory } =
        useGetSalesHistoryQuery(userId || '', { skip: !isAuthorized || !userId });

    // Transform the real data to match our display format
    const transformedSalesData: TransformedSalesData[] = salesHistory?.data?.map((transaction: SalesTransaction) => ({
        id: transaction?._id,
        date: transaction?.createdAt,
        buyer: transaction?.userId?.name,
        buyerEmail: transaction?.userId?.email,
        product: transaction?.packId?.title,
        amount: transaction?.price,
        producerId: transaction?.selectedProducerId,
        packId: transaction?.packId?._id,
        updatedAt: transaction?.updatedAt,
    })) || [];

    // Calculate summary statistics from real data
    const totalSales = transformedSalesData.reduce((sum: number, sale: TransformedSalesData) => sum + sale.amount, 0);
    const totalTransactions = transformedSalesData.length;
    const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    const filteredSales = transformedSalesData.filter((sale: TransformedSalesData) => {
        const matchesSearch =
            sale.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.product.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = selectedDate
            ? sale.date.split('T')[0] === format(selectedDate, 'yyyy-MM-dd')
            : true;

        const matchesStatus = selectedStatus === 'all';

        return matchesSearch && matchesDate && matchesStatus;
    });

    // Pagination logic
    const totalItems = filteredSales.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSales = filteredSales.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Reset to first page when filters change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setCurrentPage(1);
    };

    // const handleExport = () => {
    //     console.log('Exporting sales data...');
    // };

    const handleTransactionClick = (transaction: TransformedSalesData) => {
        setSelectedTransaction(transaction);
        setIsTransactionModalOpen(true);
    };

    if (isLoadingUser || !isAuthorized) {
        return (
          <Layout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-4xl flex justify-center items-center">
                <div className="text-white">Loading...</div>
              </div>
            </div>
          </Layout>
        );
      }

    if (isLoadingSalesHistory) {
        return (
            <Layout>
                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Sales History
                        </h1>
                        <p className="mt-2 text-zinc-400">
                            Loading your sales data...
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Sales History
                    </h1>
                    <p className="mt-2 text-zinc-400">
                        View and manage your sales transactions
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                    <Card className="border-0 bg-[#0F0F0F] p-6">
                        <div className="text-sm font-medium text-zinc-400">
                            Total Sales
                        </div>
                        <div className="mt-2 text-3xl font-bold text-emerald-500">
                            ${totalSales.toFixed(2)}
                        </div>
                    </Card>

                    <Card className="border-0 bg-[#0F0F0F] p-6">
                        <div className="text-sm font-medium text-zinc-400">
                            Total Transactions
                        </div>
                        <div className="mt-2 text-3xl font-bold text-white">
                            {totalTransactions}
                        </div>
                    </Card>

                    <Card className="border-0 bg-[#0F0F0F] p-6">
                        <div className="text-sm font-medium text-zinc-400">
                            Average Order Value
                        </div>
                        <div className="mt-2 text-3xl font-bold text-white">
                            ${averageOrderValue.toFixed(2)}
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <Input
                                placeholder="Search by buyer name or product..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-9 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                            />
                        </div>
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800"
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                {selectedDate ? (
                                    format(selectedDate, 'PPP')
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
                            <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateChange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Sales Table */}
                <Card className="border-0 bg-[#0F0F0F]">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                        <div className="flex items-center gap-1">
                                            Date
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                        Buyer
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                        Email
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-zinc-400">
                                        Product
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-zinc-400">
                                        <div className="flex items-center justify-end gap-1">
                                            Amount
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSales.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                                            {transformedSalesData.length === 0 
                                                ? 'No sales transactions found' 
                                                : 'No transactions match your search criteria'
                                            }
                                        </td>
                                    </tr>
                                ) : (
                                    currentSales.map((sale) => (
                                        <tr
                                            key={sale.id}
                                            className=" odd:bg-zinc-900 even:bg-zinc-900/50 hover:bg-zinc-900/30 duration-300"
                                            onClick={() =>
                                                handleTransactionClick(sale)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                                                {format(
                                                    new Date(sale.date),
                                                    'MMM d, yyyy'
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-white">
                                                {sale.buyer}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                                                {sale.buyerEmail}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-400">
                                                {sale.product}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-white">
                                                ${sale.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 mb-24">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>
                )}
            </div>

            {/* Transaction Details Modal */}
            <Dialog
                open={isTransactionModalOpen}
                onOpenChange={setIsTransactionModalOpen}
            >
                <DialogContent className="sm:max-w-[600px] bg-[#0F0F0F] border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-emerald-500" />
                            Transaction Details
                            <span className="text-emerald-500 ml-2">
                                {selectedTransaction?.id}
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Complete information about this transaction
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTransaction && (
                        <div className="space-y-6 py-4">
                            {/* Transaction Summary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-400">
                                        Date
                                    </h3>
                                    <p className="text-white">
                                        {format(
                                            new Date(selectedTransaction.date),
                                            'MMMM d, yyyy'
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-400">
                                        Amount
                                    </h3>
                                    <p className="text-lg font-bold text-emerald-500">
                                        ${selectedTransaction.amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <Separator className="bg-zinc-800" />

                            {/* Buyer Information */}
                            <div>
                                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                                    Buyer Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs text-zinc-500">
                                            Name
                                        </h4>
                                        <p className="text-white">
                                            {selectedTransaction.buyer}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-zinc-500">
                                            Email
                                        </h4>
                                        <div className="flex items-center gap-1">
                                            <p className="text-white">{selectedTransaction.buyerEmail}</p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-zinc-400 hover:text-white"
                                                onClick={() => navigator.clipboard.writeText(selectedTransaction.buyerEmail)}
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-zinc-500">
                                            Transaction ID
                                        </h4>
                                        <p className="text-white">
                                            {selectedTransaction.id}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-zinc-500">
                                            Producer ID
                                        </h4>
                                        <p className="text-white">
                                            {selectedTransaction.producerId}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-zinc-800" />

                            {/* Product Information */}
                            <div>
                                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                                    Product Information
                                </h3>
                                <div className="flex gap-4">
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                        <Image
                                            src="/placeholder.svg?height=64&width=64"
                                            alt={selectedTransaction.product}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">
                                            {selectedTransaction.product}
                                        </h4>
                                        <p className="text-xs text-zinc-400">
                                            License: Standard License
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            Product ID: {selectedTransaction.packId}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-zinc-800" />

                            {/* Actions */}
                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    className="border-zinc-800 bg-transparent text-white hover:bg-zinc-800"
                                >
                                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                                    Download Invoice
                                </Button>
                                <Button className="bg-emerald-500 text-black hover:bg-emerald-600">
                                    Contact Buyer
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
