"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  ShoppingCart,
  UserCog,
  ListMusic,
  Heart,
  Download,
  Receipt,
  FileMusic,
  Upload,
  LogOut,
  Trash2,
  BarChart2,
  Crown,
  LayoutDashboard,
  Search,
  Users,
  Store,
  Activity,
  User,
  Shield,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/components/cart-context";
import ProtectedRoute from "@/Private/ProtectedRoute";
import { toast } from "sonner";
import { useLoggedInUser } from "@/app/store/api/authApis/authApi";
import { useAuth0 } from "@auth0/auth0-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout: auth0Logout } = useAuth0();
  const router = useRouter();

  const logout = async () => {
    try {
      localStorage.clear();

      // Call Auth0 logout
      await auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
      // Clear any session cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      window.location.href = "/";
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
  };

  const pathname = usePathname();
  const { cartItems, removeFromCart } = useCart();
  const { data: user } = useLoggedInUser();

  const isPro = user?.data?.isPro;

  console.log("isPro from layout component", isPro);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const NavLinks = () => (
    <>
      {isPro ? (
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 ${
            pathname === "/dashboard" ? "text-white" : "text-zinc-400"
          } hover:text-white`}
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
      ) : (
        ""
      )}
      <Link
        href="/browse"
        className={`flex items-center gap-2 ${
          pathname === "/browse" ? "text-white" : "text-zinc-400"
        } hover:text-white`}
      >
        <Search className="h-5 w-5" />
        Browse
      </Link>
      <Link
        href="/producers"
        className={`flex items-center gap-2 ${
          pathname === "/producers" ? "text-white" : "text-zinc-400"
        } hover:text-white`}
      >
        <Users className="h-5 w-5" />
        Producers
      </Link>
      <Link
        href="/marketplace"
        className={`flex items-center gap-2 ${
          pathname === "/marketplace" ? "text-white" : "text-zinc-400"
        } hover:text-white`}
      >
        <Store className="h-5 w-5" />
        Marketplace
      </Link>
      <Link
        href="/feed"
        className={`flex items-center gap-2 ${
          pathname === "/feed" ? "text-white" : "text-zinc-400"
        } hover:text-white`}
      >
        <Activity className="h-5 w-5" />
        Feed
      </Link>
      <Link
        href="/profile"
        className={`flex items-center gap-2 ${
          pathname === "/profile" ? "text-white" : "text-zinc-400"
        } hover:text-white`}
      >
        <User className="h-5 w-5" />
        Profile
      </Link>
      {!isPro ? (
        <Link
          href="/checkout-membership"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-[#f0b82d] ${
            pathname === "/checkout-membership"
              ? "bg-[#ffc439] text-black"
              : "bg-[#ffc439] text-black"
          }`}
        >
          <Crown className="h-4 w-4" />
          Become a Pro
        </Link>
      ) : (
        ""
      )}

      {user?.data?.role === "admin" && (
        <button
          onClick={() => router.push("/admin")}
          className="w-full flex items-center gap-2 border border-emerald-500 text-emerald-500 rounded-lg px-3 py-2 hover:bg-emerald-500 hover:text-black transition-all"
        >
          <Shield className="h-4 w-4" />
          Admin Panel
        </button>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-transparent">
      {/* Sidebar - Hidden on mobile */}
      <nav className="fixed left-0 top-0 hidden h-screen w-64 bg-zinc-950/80 backdrop-blur-md p-6 lg:block">
        <Link href="/" className="mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melody%20Collab%20Final-01-wJ6u6o1bnpgNgz28mdTurjWFCWIgGe.png"
            alt="Melody Collab Logo"
            width={180}
            height={180}
            priority
            className="mb-8 w-[70%]"
          />
        </Link>
        <div className="mt-16 space-y-6">
          <NavLinks />
        </div>
      </nav>

      {/* Top Bar */}
      <header className="fixed left-0 lg:left-64 right-0 top-0 z-50 flex h-16 items-center justify-between bg-black px-4">
        {/* Mobile Menu and Logo - Hidden on desktop */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
                >
                  <Menu className="h-5 w-5 text-zinc-400" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 border-r-0 bg-black p-0"
              >
                <div className="flex h-full flex-col">
                  <div className="p-6">
                    <div className="mb-8">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melody%20Collab%20Final-01-wJ6u6o1bnpgNgz28mdTurjWFCWIgGe.png"
                        alt="Melody Collab Logo"
                        width={180}
                        height={180}
                        priority
                        className="mb-8 w-[70%]"
                      />
                    </div>
                    <nav className="mt-16 space-y-6">
                      <NavLinks />
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Image
              src="/isotype.png"
              alt="Melody Collab"
              width={32}
              height={32}
              priority
              className="h-8 w-8"
            />
          </div>

          {/* Mobile profile button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Cart Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-emerald-500 bg-zinc-900 p-0 hover:bg-zinc-800"
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <div className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                        {cartItems.length}
                      </div>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 bg-zinc-900 border-zinc-800 text-white"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Shopping Cart</h3>
                    <span className="text-xs text-zinc-400">
                      {cartItems.length} items
                    </span>
                  </div>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {item.title}
                          </h4>
                          <div className="text-xs text-zinc-400">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {cartItems.length > 0 && (
                    <>
                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between mb-4 text-sm">
                          <span className="font-medium">Total</span>
                          <span className="font-bold">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                        <Button
                          asChild
                          className="w-full bg-emerald-500 hover:bg-emerald-600"
                        >
                          <Link href="/cart">View Cart</Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full overflow-hidden border border-emerald-500 bg-zinc-900 p-0 hover:bg-zinc-800"
                >
                  <Image
                    src={user?.data?.profile_image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-zinc-900 border-zinc-800 text-white"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="hover:bg-transparent focus:bg-transparent"
                  >
                    <Link
                      href="/account"
                      className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                    >
                      <UserCog className="h-4 w-4" />
                      <span>Manage Account</span>
                    </Link>
                  </DropdownMenuItem>
                  {isPro && (
                    <DropdownMenuItem
                      asChild
                      className="hover:bg-transparent focus:bg-transparent"
                    >
                      <Link
                        href="/items"
                        className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                      >
                        <ListMusic className="h-4 w-4" />
                        <span>Your Items</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="hover:bg-transparent focus:bg-transparent"
                  >
                    <Link
                      href="/favorites"
                      className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                    >
                      <Heart className="h-4 w-4" />
                      <span>My Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="hover:bg-transparent focus:bg-transparent"
                  >
                    <Link
                      href="/purchases"
                      className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                    >
                      <Receipt className="h-4 w-4" />
                      <span>My Purchases</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-800" />
                {isPro && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        asChild
                        className="hover:bg-transparent focus:bg-transparent"
                      >
                        <Link
                          href="/analytics"
                          className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                        >
                          <BarChart2 className="h-4 w-4" />
                          <span>Analytics</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="hover:bg-transparent focus:bg-transparent"
                      >
                        <Link
                          href="/sales"
                          className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                        >
                          <Receipt className="h-4 w-4" />
                          <span>Sales History</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                  </>
                )}
                {isPro && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        asChild
                        className="hover:bg-transparent focus:bg-transparent"
                      >
                        <Link
                          href="/new-pack"
                          className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                        >
                          <FileMusic className="h-4 w-4" />
                          <span>Add New Pack</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="hover:bg-transparent focus:bg-transparent"
                      >
                        <Link
                          href="/upload"
                          className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload Melodies</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                  </>
                )}
                <DropdownMenuItem
                  asChild
                  className="hover:bg-transparent focus:bg-transparent"
                >
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500 bg-zinc-900 text-white hover:bg-zinc-800"
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems.length > 0 && (
                    <div className="absolute -top-4 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-medium text-white">
                      {cartItems.length}
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-zinc-900 border-zinc-800 text-white"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Shopping Cart</h3>
                  <span className="text-xs text-zinc-400">
                    {cartItems.length} items
                  </span>
                </div>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {item.title}
                        </h4>
                        <div className="text-xs text-zinc-400">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {cartItems.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-zinc-400">
                        Your cart is empty
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {cartItems.length > 0 && (
                <>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Link href="/cart">View Cart</Link>
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {isPro && (
            <Button
              asChild
              className="h-12 rounded-full bg-emerald-500 px-6 text-base font-medium text-black hover:bg-emerald-600"
            >
              <Link href="/upload">Upload Melody</Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-12 items-center gap-2 rounded-full border border-emerald-500 bg-zinc-900 px-4 text-base font-medium text-white hover:bg-zinc-800"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={user?.data?.profile_image}
                    alt="Profile"
                    width={500}
                    height={500}
                    className="object-cover h-full w-full"
                  />
                </div>
                <span>Profile</span>
                <ChevronDown className="h-5 w-5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-900 border-zinc-800 text-white"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-transparent focus:bg-transparent"
                >
                  <Link
                    href="/account"
                    className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                  >
                    <UserCog className="h-4 w-4" />
                    <span>Manage Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-transparent focus:bg-transparent"
                >
                  <Link
                    href="/items"
                    className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                  >
                    <ListMusic className="h-4 w-4" />
                    <span>Your Items</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-transparent focus:bg-transparent"
                >
                  <Link
                    href="/favorites"
                    className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                  >
                    <Heart className="h-4 w-4" />
                    <span>My Favorites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-transparent focus:bg-transparent"
                >
                  <Link
                    href="/purchases"
                    className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                  >
                    <Receipt className="h-4 w-4" />
                    <span>My Purchases</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-800" />
              {isPro && (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      asChild
                      className="hover:bg-transparent focus:bg-transparent"
                    >
                      <Link
                        href="/analytics"
                        className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                      >
                        <BarChart2 className="h-4 w-4" />
                        <span>Analytics</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="hover:bg-transparent focus:bg-transparent"
                    >
                      <Link
                        href="/sales"
                        className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                      >
                        <Receipt className="h-4 w-4" />
                        <span>Sales History</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                </>
              )}
              {isPro && (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      asChild
                      className="hover:bg-transparent focus:bg-transparent"
                    >
                      <Link
                        href="/new-pack"
                        className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                      >
                        <FileMusic className="h-4 w-4" />
                        <span>Add New Pack</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="hover:bg-transparent focus:bg-transparent"
                    >
                      <Link
                        href="/upload"
                        className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload Melodies</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                </>
              )}
              <DropdownMenuItem
                asChild
                className="hover:bg-transparent focus:bg-transparent"
              >
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 text-white hover:text-emerald-500 transition-colors [&>svg]:hover:text-emerald-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <ProtectedRoute role="user">
        <main className="lg:ml-64 pt-16">{children}</main>
      </ProtectedRoute>
    </div>
  );
}
