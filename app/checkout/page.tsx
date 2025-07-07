"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Check, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout";
import axios from "axios";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

// Sample cart items data
const cartItems = [
  {
    id: 1,
    title: "Bumper Pack Vol.1",
    producer: "Thunder Beatz",
    price: 35.0,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png",
  },
  {
    id: 2,
    title: "Radio Lotto Pack",
    producer: "Thunder Beatz",
    price: 20.0,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlbedoBase_XL_colorful_music_sample_pack_square_cover_0%201-qogxcWag2VJauGOf0wg17yNh1prb26.png",
  },
];

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + tax;
  const [amount, setAmount] = useState("10");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page or show success message
    }, 2000);
  };
  const userId = "686378d1394a32f019c80030";

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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-zinc-400">
                        First name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-zinc-400">
                        Last name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
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
                        <div className="h-5 w-10 relative">
                          <Image
                            src="/placeholder.svg?height=20&width=40"
                            alt="PayPal"
                            width={40}
                            height={20}
                            className="object-contain"
                          />
                        </div>
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

                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full bg-emerald-500 text-black hover:bg-emerald-600 h-12"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Pay $${total.toFixed(2)}`
                      )}
                    </Button>

                    <label>
                      Amount (USD):{" "}
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </label>

                    <br />
                    <br />

                    <PayPalScriptProvider
                      options={{
                        "client-id": "AVswCL11GjsPViCr50ojjbD8MR5rA-c9aJe_Z2gqKbe9wftYSC_soMsITBccidloPD-aCYR9e7g4kwS7",
                      }}
                    >
                      <PayPalButtons
                        createOrder={async () => {
                          const res = await axios.post(
                            "http://localhost:5000/create-order",
                            {
                              amount,
                              userId
                            }
                          );
                          return res.data.id;
                        }}
                        onApprove={async (data, actions) => {
                          const res = await axios.post(
                            `http://localhost:5000/capture-order/${data.orderID}`
                          );
                          alert("Payment successful!");
                          console.log(222, res.data);
                        }}
                        onError={(err) => {
                          console.error("PayPal Checkout onError", err);
                          alert("Something went wrong");
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
                  {cartItems.map((item) => (
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
