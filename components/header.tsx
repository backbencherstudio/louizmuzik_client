"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLoggedInUserQuery } from "@/app/store/api/authApis/authApi";
import { useAuth } from "./Provider/GoogleProvider";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: user,} = useLoggedInUserQuery(null);

  const { isAuthenticated } = useAuth();

  
  return (
    <header className="w-full py-4 px-4 md:px-8 bg-black">
      <div className="container mx-auto flex items-center justify-between">
        {/* Mobile Layout */}
        {isMobile ? (
          <>
            {/* Left - Hamburger Menu and Isotype */}
            <div className="flex items-center gap-3">
              <button
                className="text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/isotype-6Yqgp9GjlrpnaphmU3uWvk6lNdWz79.png"
                  alt="MelodyCollab Isotype"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Right - Login and Try Now buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link href="/dashboard">Dashboard</Link>
              ) : (
                <Link href="/login">Log In</Link>
              )}
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-100 rounded-full px-4 py-1 h-auto text-sm"
              >
                <Link href="#pricing">Try now</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Desktop Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-RtslSNx4eNvRAL0cKeP7U5KM4sNRt6.png"
                alt="MelodyCollab Logo"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/login"
                className="text-white hover:text-primary transition-colors"
              >
                Melodies
              </Link>
              <Link
                href="/login"
                className="text-white hover:text-primary transition-colors"
              >
                Feed
              </Link>
              <Link
                href="#pricing"
                className="text-white hover:text-primary transition-colors"
              >
                Pricing
              </Link>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                asChild
                variant="outline"
                className="border-primary text-white hover:bg-primary hover:text-black"
              >
                {user || isAuthenticated ? (
                  <Link href="/dashboard">Dashboard</Link>
                ) : (
                  <Link href="/login">Log In</Link>
                )}
              </Button>
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link href="#pricing">Try For Free</Link>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="absolute top-16 left-0 right-0 bg-black z-50 border-t border-gray-800 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              href="/login"
              className="text-white hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Melodies
            </Link>
            <Link
              href="/login"
              className="text-white hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Feed
            </Link>
            <Link
              href="#pricing"
              className="text-white hover:text-primary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
