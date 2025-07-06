import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    PieChart,
    DollarSign,
    TrendingUp,
    ShoppingCart,
    Users,
    Globe,
} from 'lucide-react';

export function MarketplaceAnalyticsSection() {
    return (
        <section className="w-full py-24 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage: `radial-gradient(#0CCF9F 1px, transparent 1px)`,
                            backgroundSize: '30px 30px',
                        }}
                    ></div>
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left side - Text content */}
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                            <ShoppingCart className="w-4 h-4" />
                            <span className="font-semibold">Marketplace</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            Sell your sample packs in our marketplace and{' '}
                            <span className="text-primary">
                                earn money today!
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Unlock your earning potential in our dedicated
                            marketplace for music producers. Reach the right
                            audience and maximize your earnings!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">
                                        Sales Analytics
                                    </h3>
                                    <p className="text-gray-400">
                                        Track your performance with detailed
                                        metrics
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">
                                        Seller Dashboard
                                    </h3>
                                    <p className="text-gray-400">
                                        Manage sales and stats
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <Globe className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">
                                        Global Reach
                                    </h3>
                                    <p className="text-gray-400">
                                        Sell to producers worldwide
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">
                                        Revenue Control
                                    </h3>
                                    <p className="text-gray-400">
                                        Set Your Own Prices
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="bg-primary text-black hover:bg-primary/90 px-8 py-4 text-lg h-auto"
                        >
                            <Link href="#pricing">Start Selling Today</Link>
                        </Button>
                    </div>

                    {/* Right side - Analytics Dashboard */}
                    <div className="lg:w-1/2">
                        <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                            {/* Dashboard Header */}
                            <div className="bg-black p-4 border-b border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-bold">
                                        Sales Analytics Dashboard
                                    </h3>
                                </div>
                                <div className="hidden sm:flex gap-2">
                                    <div className="px-3 py-1 rounded-md bg-black text-gray-400 text-sm">
                                        This Month
                                    </div>
                                    <div className="px-3 py-1 rounded-md bg-black text-gray-400 text-sm">
                                        Last 90 days
                                    </div>
                                    <div className="px-3 py-1 rounded-md bg-primary/10 text-primary text-sm">
                                        YTD
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6">
                                {/* Revenue Overview */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-300">
                                            Revenue Overview
                                        </h4>
                                        <div className="text-primary font-bold">
                                            +24% ↑
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold">
                                                $17,490
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                Total Revenue
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-3xl font-bold">
                                                594
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                Total Sales
                                            </div>
                                        </div>
                                        <div className="hidden sm:block flex-1">
                                            <div className="text-3xl font-bold">
                                                $29.45
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                Avg. Price
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sales Chart - UPDATED */}
                                <div className="mb-6">
                                    <div className="h-[180px] w-full relative rounded-lg overflow-hidden">
                                        {/* Chart background */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#071a2c] to-[#0a1622]"></div>

                                        {/* Grid lines */}
                                        <div className="absolute inset-0">
                                            {/* Horizontal grid lines */}
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={`h-${i}`}
                                                    className="absolute w-full h-px bg-[#1a3a5a]/40"
                                                    style={{
                                                        top: `${i * 25}%`,
                                                    }}
                                                ></div>
                                            ))}

                                            {/* Vertical grid lines */}
                                            {[
                                                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                                                10, 11,
                                            ].map((i) => (
                                                <div
                                                    key={`v-${i}`}
                                                    className="absolute top-0 bottom-0 w-px bg-[#1a3a5a]/40"
                                                    style={{
                                                        left: `${
                                                            (i * 100) / 11
                                                        }%`,
                                                    }}
                                                ></div>
                                            ))}
                                        </div>

                                        {/* Chart line */}
                                        <div className="absolute inset-0 px-6">
                                            <svg
                                                className="w-full h-full"
                                                preserveAspectRatio="none"
                                                viewBox="0 0 1100 180"
                                            >
                                                {/* Gradient for area under the line */}
                                                <defs>
                                                    <linearGradient
                                                        id="areaGradient"
                                                        x1="0%"
                                                        y1="0%"
                                                        x2="0%"
                                                        y2="100%"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#0CCF9F"
                                                            stopOpacity="0.2"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#0CCF9F"
                                                            stopOpacity="0.01"
                                                        />
                                                    </linearGradient>

                                                    {/* Gradient for the line */}
                                                    <linearGradient
                                                        id="lineGradient"
                                                        x1="0%"
                                                        y1="0%"
                                                        x2="100%"
                                                        y2="0%"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#0CCF9F"
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#0CCF9F"
                                                        />
                                                    </linearGradient>

                                                    {/* Filter for glow effect */}
                                                    <filter
                                                        id="glow"
                                                        x="-20%"
                                                        y="-20%"
                                                        width="140%"
                                                        height="140%"
                                                    >
                                                        <feGaussianBlur
                                                            stdDeviation="4"
                                                            result="blur"
                                                        />
                                                        <feComposite
                                                            in="SourceGraphic"
                                                            in2="blur"
                                                            operator="over"
                                                        />
                                                    </filter>
                                                </defs>

                                                {/* Area under the line */}
                                                <path
                                                    d="M0,120 C50,100 100,130 150,110 C200,90 250,105 300,85 C350,65 400,95 450,75 C500,55 550,75 600,45 C650,15 700,55 750,35 C800,15 850,45 900,65 C950,85 1000,55 1050,35 L1100,55 L1100,180 L0,180 Z"
                                                    fill="url(#areaGradient)"
                                                />

                                                {/* The line itself */}
                                                <path
                                                    d="M0,120 C50,100 100,130 150,110 C200,90 250,105 300,85 C350,65 400,95 450,75 C500,55 550,75 600,45 C650,15 700,55 750,35 C800,15 850,45 900,65 C950,85 1000,55 1050,35 L1100,55"
                                                    fill="none"
                                                    stroke="url(#lineGradient)"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    filter="url(#glow)"
                                                />

                                                {/* End dot */}
                                                <circle
                                                    cx="1100"
                                                    cy="55"
                                                    r="6"
                                                    fill="#0CCF9F"
                                                    filter="url(#glow)"
                                                />
                                            </svg>
                                        </div>

                                        {/* X-axis labels */}
                                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#6a8cad] px-6 pb-2">
                                            {[
                                                'Jan',
                                                'Feb',
                                                'Mar',
                                                'Apr',
                                                'May',
                                                'Jun',
                                                'Jul',
                                                'Aug',
                                                'Sep',
                                                'Oct',
                                                'Nov',
                                                'Dec',
                                            ].map((month, index) => (
                                                <div
                                                    key={index}
                                                    className={`${
                                                        index % 3 === 0
                                                            ? 'sm:block'
                                                            : 'hidden sm:block'
                                                    }`}
                                                >
                                                    {month}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Top Selling Products */}
                                <div>
                                    <h4 className="font-medium text-gray-300 mb-4">
                                        Top Selling Products
                                    </h4>
                                    <div className="space-y-3">
                                        {[
                                            {
                                                name: 'Future Bass Essentials',
                                                sales: 124,
                                                revenue: '$1,860',
                                                percent: 80,
                                            },
                                            {
                                                name: 'Trap Drums Vol.2',
                                                sales: 98,
                                                revenue: '$1,470',
                                                percent: 65,
                                            },
                                            {
                                                name: 'Lo-Fi Melodies',
                                                sales: 87,
                                                revenue: '$1,305',
                                                percent: 55,
                                            },
                                        ].map((product, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                                    <PieChart className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <div className="font-medium">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-primary font-medium">
                                                            {product.revenue}
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                                                            style={{
                                                                width: `${product.percent}%`,
                                                            }}
                                                        >
                                                            {/* Animated dots */}
                                                            <div className="absolute top-0 right-0 h-full w-2 flex items-center">
                                                                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                                            </div>
                                                        </div>
                                                        {/* Tick marks */}
                                                        <div className="absolute inset-0 flex justify-between items-center px-1">
                                                            {[
                                                                20, 40, 60, 80,
                                                            ].map((tick) => (
                                                                <div
                                                                    key={tick}
                                                                    className="h-2 w-[1px] bg-gray-700"
                                                                ></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between mt-1">
                                                        <div className="text-xs text-gray-400">
                                                            {product.sales}{' '}
                                                            sales
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {product.percent}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
