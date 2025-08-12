/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {  Check, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "@/components/cart-context";
import { useLoggedInUser } from "../store/api/authApis/authApi";
import { usePurchasePackMutation } from "../store/api/paymentApis/paymentApis";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: user, refetch } = useLoggedInUser();
  const userData =  user?.data;
  console.log(25, userData);
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems } = useCart();
  console.log("cartItems", cartItems);
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + tax;
  const [amount, setAmount] = useState(total);
  const [purchasePack, { isLoading: isPurchasePackLoading }] = usePurchasePackMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page or show success message
    }, 2000);
  };


  const selectedData = cartItems.map(item => ({
    selectedProducerId: item.producerId,
    price: item.price,
  }));

  const selectedPackData = cartItems.map(item => ({
    userId: userData?._id, 
    packId: item.id,
    selectedProducerId: item.producerId, 
    price: item.price,
  }));

  const successFunction = async (data: any) => {
    console.log(81, data?.data?.id);
    console.log(82, data?.data?.status);

    if (data.data.id && data?.data?.status === "COMPLETED") {
      console.log(selectedPackData);
      const res = await purchasePack(selectedPackData);
      if (res.data.success) {
        toast.success("Pack purchased successfully");
        refetch();
        router.push("/purchases");
      } else {
        toast.error("Pack purchase failed");
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <Link
              href="/cart"
              className="inline-flex items-center text-sm text-zinc-400 hover:text-emerald-500 transition-colors"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to cart
            </Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Checkout
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Payment Form */}
            <div className="space-y-6">
              <Card className="border-0 bg-[#0F0F0F] p-6">
                <h2 className="text-xl font-medium text-white mb-4">
                  Billing Information
                </h2>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-zinc-400">
                        Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={userData?.name || userData?.producer_name}
                        className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-400">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={userData?.email}
                      className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-[#0F0F0F] p-6">
                <h2 className="text-xl font-medium text-white mb-4">
                  Payment Method
                </h2>
                <form onSubmit={handleSubmit}>
                  {/* PayPal Option */}
                  <div className="rounded-lg border border-emerald-500 p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center gap-2 cursor-pointer">
                        <span className="text-white">PayPal & Credit Card</span>
                      </div>
                    </div>

                    <div className="mt-4 text-zinc-400 text-sm">
                      <p>
                        You will be redirected to PayPal to complete your
                        purchase securely. You can pay with your PayPal balance
                        or credit card.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 w-full h-16 p-1 overflow-hidden ml-5">
                    <PayPalScriptProvider
                      options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                      }}
                    >
                      <PayPalButtons
                        createOrder={async () => {
                          const res = await axios.post(
                            "http://localhost:5000/api/v1/payment/create-order",
                            {
                              amount,
                              selectedData,
                            }
                          );
                          return res.data.data.id;
                        }}
                        onApprove={async (data) => {
                          try {
                            const res = await axios.post(
                              `http://localhost:5000/api/v1/payment/capture-order/${data.orderID}`
                            );

                            alert("✅ Payment successful!");
                            await successFunction(res.data);
                          } catch (err: any) {
                            const message =
                              err?.response?.data?.message ||
                              "❌ Payment failed due to an unknown error.";
                            alert(`❌ Payment Failed: ${message}`);
                            console.error(
                              "💥 Detailed PayPal Error:",
                              err?.response?.data
                            );
                          }
                        }}
                        onError={(err) => {
                          console.error("❌ PayPal JS SDK Error:", err);
                          alert(
                            "❌ Something went wrong with PayPal integration. Try again later."
                          );
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </form>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="border-0 bg-[#0F0F0F] p-6 sticky top-24">
                <h2 className="text-xl font-medium text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {item.producer}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-white">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}

                  <Separator className="border-zinc-800" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-zinc-400">Subtotal</p>
                      <p className="text-white">${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-zinc-400">Tax (7%)</p>
                      <p className="text-white">${tax.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between text-base font-medium">
                      <p className="text-white">Total</p>
                      <p className="text-white">${total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="rounded-md bg-zinc-900/50 p-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <p className="text-xs text-zinc-400">
                        Your personal data will be used to process your order,
                        support your experience, and for other purposes
                        described in our privacy policy.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
