"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  FileText,
  X as CloseIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Layout from "@/components/layout";
import axios from "axios";
import { useLoggedInUser } from "../store/api/authApis/authApi";

export default function SubscriptionPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { data: user } = useLoggedInUser();
  const userData = user?.data;
  console.log(userData);
  const customerId = userData?.customerId;
  console.log(customerId);

  

  const handleStripeCancelSubscription = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/payment/cancel-subscription/${customerId}`
      );
      console.log("Subscription cancelled successfully");
      alert("Subscription cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel subscription", err);
    }
  };

//   const handleCancelSubscription = async () => {
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/v1/payment/paypalSubscriptionCancel/${paypalSubscriptionId}`
//       );
//       console.log("Subscription cancelled successfully");
//       alert("Subscription cancelled successfully");
//     } catch (err) {
//       console.error("Failed to cancel subscription", err);
//     }
//   };
  // Mock data - En producción esto vendría de tu backend
  const subscriptionData = {
    plan: "Pro Plan",
    price: 9.99,
    nextBillingDate: "2025-04-15",
    paymentMethod: {
      type: "Visa",
      lastFour: "4242",
      expiryDate: "12/25",
    },
    billingHistory: [
      {
        date: "Mar 15, 2025",
        description: "Pro Plan Subscription",
        amount: 9.99,
        status: "Paid",
      },
      {
        date: "Feb 15, 2025",
        description: "Pro Plan Subscription",
        amount: 9.99,
        status: "Paid",
      },
      {
        date: "Jan 15, 2025",
        description: "Pro Plan Subscription",
        amount: 9.99,
        status: "Paid",
      },
    ],
  };

  const planFeatures = [
    "Unlimited melody uploads",
    "Premium marketplace visibility",
    "Advanced analytics and insights",
    "Priority customer support",
    "Exclusive producer collaborations",
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black p-6 lg:p-8">
        <div className="max-w-[1000px] mx-auto px-4">
          {/* Back Button and Header */}
          <div className="mb-8">
            <Link
              href="/account"
              className="inline-flex items-center text-zinc-400 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">
              Manage Your Subscription
            </h1>
            <p className="text-zinc-400">
              View your current plan, update your payment details, or make
              changes to your subscription.
            </p>
          </div>

          {/* Current Plan */}
          <div className="bg-[#0F0F0F] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Current Plan
            </h2>
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-white">
                    {subscriptionData.plan}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500">
                    Active
                  </span>
                </div>
                <p className="text-zinc-400">${subscriptionData.price}/month</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400 mb-1">Next billing date</p>
                <p className="text-white font-medium">April 15, 2025</p>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">
                Your plan includes:
              </h4>
              <ul className="space-y-3">
                {planFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-zinc-400">
                    <svg
                      className="w-5 h-5 text-emerald-500 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[#0F0F0F] rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold text-white mb-4 md:mb-6">
                Payment Method
              </h2>
              <div className="mb-4 md:mb-0">
                <Button
                  variant="outline"
                  className="w-full md:w-auto bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white"
                >
                  Change Payment Method
                </Button>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-zinc-900 p-2 rounded mr-4">
                <CreditCard className="w-6 h-6 text-zinc-400" />
              </div>
              <div>
                <p className="text-white">
                  Visa ending in {subscriptionData.paymentMethod.lastFour}
                </p>
                <p className="text-sm text-zinc-400">
                  Expires {subscriptionData.paymentMethod.expiryDate}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-zinc-400">
              <Shield className="w-4 h-4 mr-2 text-emerald-500" />
              Your payment information is securely stored and encrypted
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-[#0F0F0F] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Billing History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-zinc-400 border-b border-zinc-800">
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Description</th>
                    <th className="pb-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionData.billingHistory.map((item, index) => (
                    <tr key={index} className="border-b border-zinc-800">
                      <td className="py-4 text-zinc-400">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {item.date}
                        </div>
                      </td>
                      <td className="py-4 text-zinc-400">{item.description}</td>
                      <td className="py-4 text-zinc-400">${item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cancel Subscription */}
          <div className="bg-[#0F0F0F] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Cancel Subscription
            </h2>
            <p className="text-zinc-400 mb-6">
              If you cancel, your subscription will remain active until the end
              of your current billing period.
            </p>
            <Button
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Subscription
            </Button>
            <div className="mt-6 text-sm text-zinc-400">
              Need help with your subscription? Contact our{" "}
              <Link href="#" className="text-emerald-500 hover:underline">
                customer support team
              </Link>
              .
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="bg-[#0F0F0F] border-zinc-800 p-0">
          <div className="relative p-6">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-semibold text-white mb-2">
              Are you sure you want to cancel?
            </h2>
            <p className="text-zinc-400 text-lg mb-6">
              You will lose access to the following benefits:
            </p>

            <div className="bg-zinc-900 rounded-lg p-6 mb-6">
              <ul className="space-y-4">
                {planFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-zinc-400 text-lg"
                  >
                    <CloseIcon className="h-5 w-5 text-red-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-zinc-400 mb-8">
              Your subscription will remain active until April 15, 2025. After
              that, your account will be downgraded to the Free plan.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white"
                onClick={() => setShowCancelModal(false)}
              >
                Keep My Subscription
              </Button>
              <Button
                onClick={handleStripeCancelSubscription}
                variant="destructive"
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
