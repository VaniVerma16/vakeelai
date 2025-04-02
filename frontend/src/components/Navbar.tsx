"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        {/* Left section - Logo (Same for both mobile and desktop) */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80 group"
          >
            <Image
              src="/logo.png"
              alt="Vakeel.ai Logo"
              width={50}
              height={50}
              className="h-10 w-12 group-hover:scale-105 transition-transform"
            />
            <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">
              Vakeel.ai
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-grow justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-1 md:gap-2">
              {/* Features Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm md:text-base font-medium hover:bg-accent hover:text-accent-foreground">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-2 md:w-[500px] bg-popover shadow-lg rounded-xl">
                    <ListItem
                      href="/contract-generation"
                      title="Generate Contract"
                    >
                      Create legal contracts with AI assistance
                    </ListItem>
                    <ListItem href="/riskdetection" title="Risk Detection">
                      Identify potential legal risks in your documents
                    </ListItem>
                    <ListItem
                      href="/contract-analyzer"
                      title="Compliance Intelligence"
                    >
                      Make sure your contract is up to date with new rules.
                    </ListItem>
                    <ListItem
                      href="http://localhost:5173/"
                      title="Negotiate Contracts"
                    >
                      Negotiate contracts and come to a middle ground.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pricing Link */}
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm md:text-base font-medium hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/contact"
            className="rounded-md bg-primary hover:bg-primary/90 transition-colors px-4 py-2 text-sm md:text-base font-medium text-primary-foreground shadow-sm"
          >
            Contact Us
          </Link>
          <div>
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Right Section - Hamburger Menu & Theme Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <div>
            <ModeToggle />
          </div>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMenu}
                className="border-primary/20 hover:border-primary/40"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[540px]">
              <SheetHeader className="border-b-2 pb-4 mb-4">
                <SheetTitle className="text-xl">Menu</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-4 py-2">
                {/* Mobile Features Dropdown */}
                <details className="group border-b-2 pb-2">
                  <summary className="cursor-pointer py-2 font-medium flex items-center justify-between">
                    Features
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      href="/contract-generation"
                      className="block py-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2"
                      onClick={toggleMenu}
                    >
                      Generate Contract
                    </Link>
                    <Link
                      href="/riskdetection"
                      className="block py-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2"
                      onClick={toggleMenu}
                    >
                      Risk Detection
                    </Link>
                    <Link
                      href="/contract-analyzer"
                      className="block py-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2"
                      onClick={toggleMenu}
                    >
                      Analyze Contract
                    </Link>
                  </div>
                </details>
                {/* Mobile Pricing Link */}
                <Link
                  href="/pricing"
                  className="py-2 font-medium border-b-2 pb-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2"
                  onClick={toggleMenu}
                >
                  Pricing
                </Link>

                {/* Mobile Contact Link */}
                <Link
                  href="/contact"
                  className="py-2 font-medium border-b-2 pb-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2"
                  onClick={toggleMenu}
                >
                  Contact Us
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  href: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            href={href}
            className={cn(
              "block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-base font-semibold leading-tight mb-1">
              {title}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export default Navbar;
