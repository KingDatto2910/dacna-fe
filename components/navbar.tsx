"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CartSheet from "./cart-sheet";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

/**
 * @description The main navigation component.
 *
 * @returns {JSX.Element} - The navigation component.
 */
export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Handle search form submission.
   *
   * @param {React.FormEvent} e - Event object.
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      // Redirect to search results page with query parameter.
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // THAY ĐỔI: Cập nhật link 'Home' trỏ đến '/home'
  const routes = [
    { href: "/home", label: "Home" }, // <-- THAY ĐỔI Ở ĐÂY
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-white border-b">
      <div className="container mx-auto md:py-6 md:px-8 flex h-16 items-center">
        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="text-sm text-bold hidden">Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8 px-12">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* THAY ĐỔI: Logo trỏ đến '/home' */}
        <Link
          className="flex items-center gap-2 ml-4 md:ml-0 md:mr-8"
          href="/home" // <-- THAY ĐỔI Ở ĐÂY
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="font-bold text-xl">Store</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="font-medium transition-colors hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Search, User & Cart */}
        <div className="flex items-center gap-4 ml-auto px-4 md:px-0">
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full md:w-[200px] lg:w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push("/search")}
          >
            <Search className="w-5 h-5" />
          </Button>

          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <User className="h-5 w-5" />
              <span className="sr-only">Login / User Account</span>
            </Link>
          </Button>
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
