"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout";
import SubscribeForm from "../SubscribeForm/page";
import { useState } from "react";
import axios from "axios";

export default function ProPage() {
  const [amount, setAmount] = useState("10");
  const [loading, setLoading] = useState(false);

  // const email = "fozlerabbishuvo@gmail.com"; 
  const email = "fozlerabbi9790@gmail.com"; 

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/payment/paypalSubscription",
        {
          amount,
          email,
        }
      );
      console.log(res);
      console.log(res?.data?.data);
      console.log(res?.data?.data?.url);

      window.location.href = res?.data?.data?.url; // Redirect to PayPal approval
    } catch (err) {
      console.log(26, err);

      alert("Error creating subscription");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const paypalSubscriptionId = "I-1PJAFMCDFXK1"

  const handleCancelSubscription = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/payment/paypalSubscriptionCancel/${paypalSubscriptionId}`);
      console.log("Subscription cancelled successfully");
      alert("Subscription cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel subscription", err);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-6 md:mb-12">
            <h1 className="mb-3 md:mb-4 text-3xl md:text-4xl font-bold text-white">
              Start your 7-day free trial
            </h1>
            <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
              Get access to all the benefits today for free and take your career
              to the next level.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start">
              {/* Summary Card - Reordered for mobile */}
              <div className="lg:order-2 mx-auto w-full max-w-md">
                <Card className="border-0 bg-zinc-900/50 p-6 mb-8 lg:mb-0">
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-zinc-400">
                        You&apos;re paying
                      </div>
                      <div className="text-4xl md:text-5xl font-bold text-emerald-500">
                        $0.00
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                      <div>
                        <div className="font-medium text-white">
                          Free Pro Trial
                        </div>
                      </div>
                      <div className="text-lg text-zinc-400">$ 0.00</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">
                            Future payments
                          </div>
                          <div className="text-sm text-zinc-500">
                            Starting on March 2, 2025
                          </div>
                        </div>
                        <div className="text-lg text-zinc-400">$ 9.99</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                      <div className="text-lg font-medium text-white">
                        Total
                      </div>
                      <div className="text-lg font-medium text-white">
                        $ 0.00
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Payment Form - Reordered for mobile */}
              <div className="lg:order-1 mx-auto w-full max-w-md">
                <div className="space-y-6">
                  {/* <Button className="w-full bg-[#ffc439] py-6 text-blue-900 hover:bg-[#f0b82d]">
                                        <Image
                                            src="/placeholder.svg?height=24&width=80"
                                            alt="PayPal"
                                            width={80}
                                            height={24}
                                            className="h-6"
                                        />
                                    </Button> */}

                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    style={{
                      padding: "10px 20px",
                      fontSize: "16px",
                      cursor: "pointer",
                      backgroundColor: "#0070f3",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                    }}
                  >
                    {loading ? "Processing..." : "Subscribe with paypal"}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black px-2 text-zinc-500">
                        Or pay with card
                      </span>
                    </div>
                  </div>

                  {/* <Card className="border-0 bg-zinc-900/50 p-6">
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="card"
                                                    className="text-zinc-400"
                                                >
                                                    Card Number
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="card"
                                                        placeholder="1234 1234 1234 1234"
                                                        className="border-zinc-800 bg-zinc-900 pl-4 pr-12 text-white placeholder:text-zinc-500"
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <Image
                                                            src="/placeholder.svg?height=20&width=32"
                                                            alt="Mastercard"
                                                            width={32}
                                                            height={20}
                                                            className="h-5"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="expiry"
                                                        className="text-zinc-400"
                                                    >
                                                        Expiration Date
                                                    </Label>
                                                    <Input
                                                        id="expiry"
                                                        placeholder="MM / YY"
                                                        className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="cvc"
                                                        className="text-zinc-400"
                                                    >
                                                        CVC
                                                    </Label>
                                                    <Input
                                                        id="cvc"
                                                        placeholder="CVC"
                                                        className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500"
                                                    />
                                                </div>
                                            </div>

                                            <Button className="w-full bg-emerald-500 py-6 text-white hover:bg-emerald-600">
                                                Start Pro Trial
                                            </Button>
                                        </form>
                                    </Card> */}

                  {/* subscribtion with stripe  */}
                  <SubscribeForm amount={29.99} />
                </div>

                <div>
                  <button onClick={handleCancelSubscription}
                  className="border border-red-500 mt-4 rounded-xl p-4"
                  >
                    {" "}
                    paypal subscription cansel{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
