"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CartSheet from "./cart-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllCategories } from "@/lib/data";

/**
 * @description The main navigation component.
 */
export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const allCategories = getAllCategories();

  /**
   * Handle search form submission.
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const routes = [
    { href: "/home", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-white border-b">
      <div className="container mx-auto md:py-6 md:px-8 flex h-16 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Shop by Department</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {allCategories.map((category) => (
              <DropdownMenuItem
                asChild
                key={category.id}
                className="cursor-pointer"
              >
                <Link href={`/categories/${category.slug}`}>
                  <div className="flex items-center justify-between w-full">
                    <span>{category.name}</span>
                    <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo */}
        <Link className="flex items-center gap-2 md:mr-8" href="/home">
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

          {/* User Button */}
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <User className="h-5 w-5" />
              <span className="sr-only">Login / User Account</span>
            </Link>
          </Button>

          {/* Cart Sheet */}
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
