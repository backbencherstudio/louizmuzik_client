'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '@/components/layout';
import { useCart } from '@/components/cart-context';

export default function CartPage() {
    const { cartItems, removeFromCart } = useCart();

    console.log(cartItems);
    

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal; // Add tax or shipping if needed

    return (
        <Layout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Shopping Cart
                        </h1>
                        <p className="mt-2 text-sm text-zinc-400">
                            {cartItems.length} items in your cart
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <Card
                                    key={item.id}
                                    className="overflow-hidden border-0 bg-[#0F0F0F]"
                                >
                                    <div className="flex gap-4 p-4">
                                        <div className="relative aspect-square w-24 sm:w-40 overflow-hidden rounded-lg flex-shrink-0">
                                            <Image
                                                src={
                                                    item.image ||
                                                    '/placeholder.svg'
                                                }
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between min-w-0">
                                            <div className="space-y-1">
                                                <h3 className="font-medium text-white text-sm sm:text-base truncate">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-emerald-500">
                                                    {item.producer}
                                                </p>
                                                <p className="text-base sm:text-lg font-bold text-white">
                                                    ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-end mt-2 sm:mt-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {cartItems.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-zinc-400 mb-4">
                                        Your cart is empty
                                    </p>
                                    <Button
                                        asChild
                                        className="bg-emerald-500 hover:bg-emerald-600"
                                    >
                                        <Link href="/marketplace">
                                            Continue Shopping
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        {cartItems.length > 0 && (
                            <div className="lg:sticky lg:top-24">
                                <Card className="border-0 bg-[#0F0F0F] p-6">
                                    <h2 className="text-lg font-medium text-white mb-4">
                                        Order Summary
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-400">
                                                Subtotal
                                            </span>
                                            <span className="text-white">
                                                ${subtotal.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="border-t border-zinc-800 pt-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-medium text-white">
                                                    Total
                                                </span>
                                                <span className="text-lg font-bold text-white">
                                                    ${total.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-zinc-400">
                                                Taxes calculated at checkout
                                            </p>
                                        </div>
                                        <Button
                                            asChild
                                            className="w-full bg-emerald-500 hover:bg-emerald-600"
                                        >
                                            <Link href="/checkout">
                                                Proceed to Checkout
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            asChild
                                            className="w-full border-zinc-800 bg-transparent text-white hover:bg-zinc-800"
                                        >
                                            <Link href="/marketplace">
                                                Continue Shopping
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
