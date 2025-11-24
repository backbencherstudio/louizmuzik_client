"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout";
import SubscribeForm from "../SubscribeForm/page";
import { useLoggedInUser } from "../store/api/authApis/authApi";
import { toast } from "sonner";

export default function ProPage() {
  const { data: user, refetch } = useLoggedInUser();
  const userData = user?.data;
  const [amount, setAmount] = useState("9.99");
  const [loading, setLoading] = useState(false);

  const email = userData?.email;
  // const email = "fozlerabbi9790@gmail.com";

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/paypalSubscription`,
        {
          amount,
          email,
        }
      );
      window.location.href = res?.data?.data?.url; // Redirect to PayPal approval
    } catch (err: any) {
      console.log(26, err);

      alert("Error creating subscription");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // === paypal
  const paypalSubscriptionId = "I-RUV3WV2KM217";

  // === stripe
  const customerId = "cus_Shu3jVVIbpezv3";

  const handleStripeCancelSubscription = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/cancel-subscription/${customerId}`
      );
      toast.success("Subscription cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel subscription", err);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/paypalSubscriptionCancel/${paypalSubscriptionId}`
      );
      toast.success("Subscription cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel subscription", err);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative px-3 py-6 sm:px-5 sm:py-10 lg:px-6 lg:py-12">
          <div className="mx-auto max-w-5xl">
            {userData?.hasUsedTrial === true ? (
              ""
            ) : (
              <div className="text-center mb-6 sm:mb-10 lg:mb-12">
                <h1 className="mb-3 sm:mb-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Start your{" "}
                  <span className="gradient-text">7-day free trial</span>
                </h1>
                <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  Get access to all the benefits today for free and take your
                  career to the next level. No commitment required.
                </p>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="max-w-4xl mx-auto">
              <div
                className={`grid gap-6 ${
                  userData?.hasUsedTrial === true
                    ? "lg:grid-cols-[1fr_450px]"
                    : "lg:grid-cols-[1fr_450px]"
                } items-start`}
              >
                {/* Payment Form Section */}
                <div className="order-2 lg:order-1">
                  <Card className="border-0 bg-zinc-900/50 backdrop-blur-sm">
                    <CardHeader className="pb-5">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-white text-center">
                        Choose Your Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* PayPal Button */}
                      <div className="space-y-3">
                        <Button
                          onClick={handleSubscribe}
                          disabled={loading}
                          className="w-full h-12 bg-[#FFC439] hover:bg-[#f9b81e] text-black font-semibold text-base transition-all duration-200 transform hover:scale-[1.01]"
                        >
                          {loading ? (
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <Image
                                src="/images/paypal.png"
                                alt="PayPal"
                                width={80}
                                height={24}
                                className="h- w-auto"
                              />
                            </div>
                          )}
                        </Button>

                        {/* Divider */}
                        <div className="relative grid grid-cols-3 items-center">
                          <hr className="w-full" />
                          <p className="text-zinc-400 text-xs text-center bg-zinc-900/50 px-3 py-1">
                            Or pay with card
                          </p>
                          <hr className="w-full" />
                        </div>

                        {/* Stripe Form */}
                        <div className="bg-zinc-800/30 rounded-xl p-5">
                          <SubscribeForm />
                        </div>
                      </div>

                      {/* Cancel Buttons - Only for testing */}
                      {/* <div className="space-y-3 pt-6 border-t border-zinc-700">
                        <Button
                          onClick={handleStripeCancelSubscription}
                          variant="outline"
                          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          Cancel Stripe Subscription (Test)
                        </Button>
                        <Button
                          onClick={handleCancelSubscription}
                          variant="outline"
                          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          Cancel PayPal Subscription (Test)
                        </Button>
                      </div> */}
                    </CardContent>
                  </Card>
                  {/* Security Notice */}
                  <div className="pt-3 max-w-4xl mx-auto">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-3 h-3 text-emerald-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="text-xs text-zinc-400">
                        Your payment information is secure and encrypted. You
                        can cancel anytime during your trial period.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="order-1 lg:order-2">
                  <Card
                    className={`border-0 ${
                      userData?.hasUsedTrial === true ? "" : "bg-zinc-900/50 "
                    } sticky top-8`}
                  >
                    <CardHeader className="pb-5">
                      <CardTitle className="text-lg sm:text-xl font-bold text-white">
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Trial Period */}
                      {userData?.hasUsedTrial === true ? (
                        ""
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white text-lg">
                                Free Pro Trial
                              </div>
                              <div className="text-sm text-zinc-400">
                                7 days of unlimited access
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-emerald-500">
                              $0.00
                            </div>
                          </div>

                          {/* Future Payments */}
                          <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                            <div>
                              <div className="font-semibold text-white text-lg">
                                Future payments
                              </div>
                              <div className="text-sm text-zinc-400">
                                Starting on March 2, 2025
                              </div>
                            </div>
                            <div className="text-xl font-semibold text-zinc-300">
                              $9.99
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Total */}
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                        <div className="text-xl font-bold text-white">
                          Total Today
                        </div>
                        <div className="text-2xl font-bold text-emerald-500">
                          {userData?.hasUsedTrial === true ? "$9.99" : "$0.00"}
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3 pt-6 border-t border-zinc-700">
                        <h4 className="font-semibold text-white text-lg mb-4">
                          What's included:
                        </h4>
                        <div className="space-y-3">
                          {[
                            "Unlimited melody uploads",
                            "Advanced analytics dashboard",
                            "Priority customer support",
                            "Exclusive sample packs",
                            "Revenue sharing opportunities",
                            "Collaboration tools",
                          ].map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                              <span className="text-zinc-300 text-base">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
