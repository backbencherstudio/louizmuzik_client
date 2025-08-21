"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout";
import { Suspense } from "react";

interface Product {
  id: string;
  title: string;
  producer: string;
  price: number;
  downloadUrl: string;
}

interface OrderDetails {
  orderId: string;
  date: string;
  total: number;
  products: Product[];
}

export default function ThankYouPage() {
  const searchParams = useSearchParams();

  // En un caso real, estos datos vendrían de la base de datos o del estado
  // usando el orderId como referencia
  const mockOrder: OrderDetails = {
    orderId: searchParams.get("orderId") || "MC-2025-00123",
    date: searchParams.get("date") || new Date().toLocaleDateString(),
    total: parseFloat(searchParams.get("total") || "29.99"),
    products: [
      {
        id: "1",
        title: "Trap Melodies Pack",
        producer: "Thunder Beatz",
        price: 19.99,
        downloadUrl: "#",
      },
      {
        id: "2",
        title: "Lo-Fi Sample Pack",
        producer: "Chill Vibes",
        price: 9.99,
        downloadUrl: "#",
      },
    ],
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] bg-black">
          <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 md:py-16">
            <div className="text-center">
              {/* Success Icon */}
              <div
                className="flex justify-center mb-6 sm:mb-8"
                aria-hidden="true"
              >
                <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500" />
              </div>

              {/* Title and Subtitle */}
              <h1
                className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4"
                role="status"
              >
                Thank You for Your Purchase!
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 mb-8 sm:mb-12">
                Your order has been confirmed and your downloads are ready.
              </p>

              {/* Order Details */}
              <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Order Details
                </h2>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Order Number</span>
                    <span className="text-white font-medium">
                      #{mockOrder.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Date</span>
                    <span className="text-white font-medium">
                      {mockOrder.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Total</span>
                    <span className="text-white font-medium">
                      ${mockOrder.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Payment Method</span>
                    <span className="text-white font-medium">PayPal</span>
                  </div>
                </div>
              </div>

              {/* Products Download Section */}
              <div className="space-y-4 mb-8 sm:mb-12">
                {mockOrder.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-emerald-500/10 rounded-xl p-4 sm:p-6"
                  >
                    <div className="text-left mb-4">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {product.title}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        by {product.producer}
                      </p>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-emerald-500 text-black hover:bg-emerald-600 h-10 sm:h-12"
                    >
                      <a href={product.downloadUrl} download>
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Download {product.title}
                      </a>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Navigation Links */}
              <div className="space-y-3 sm:space-y-4">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <p className="text-zinc-500 text-sm">
                  A confirmation email has been sent to your email address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Suspense>
  );
}
