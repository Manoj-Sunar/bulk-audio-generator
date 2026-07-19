"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { NAV_LINKS } from "@/app/lib/constants";
import { Heading } from "../typography/Heading";
import { cn } from "@/app/lib/helpers";
import { Button } from "../ui/Button";


export function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50  border-outline-variant bg-white backdrop-blur-xl">
            <nav
                className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
                aria-label="Main Navigation"
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 transition-opacity hover:opacity-90"
                >
                    <Image
                        src="/wave.svg"
                        alt="Bulk Voice Generator"
                        width={42}
                        height={42}
                        priority
                    />

                    <Heading
                        as="h1"
                        size="lg"
                        weight="bold"
                        color="primary"
                        className="hidden sm:block"
                    >
                        Bulk Voice Generator
                    </Heading>
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map(({ name, href, icon: Icon, external }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                target={external ? "_blank" : undefined}
                                rel={external ? "noopener noreferrer" : undefined}
                                className={cn(
                                    "flex items-center gap-2  px-2 py-1 transition-all duration-200 ",
                                    "text-sm font-medium text-gray-600",

                                    "transition-colors",
                                    "hover:border-b-2",
                                    "hover:text-primary"
                                )}
                            >
                                {Icon && <Icon size={18} />}

                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <Button className="px-5 rounded-full">Sign In</Button>

                {/* Mobile Button */}
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="rounded-md p-2 text-on-surface transition hover:bg-surface-container md:hidden"
                    aria-label="Toggle Navigation"
                    aria-expanded={open}
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* Mobile Navigation */}
            <div
                className={cn(
                    "overflow-hidden border-t border-outline-variant bg-background transition-all duration-300 md:hidden",
                    open ? "max-h-80" : "max-h-0"
                )}
            >
                <ul className="space-y-1 p-4">
                    {NAV_LINKS.map(({ name, href, icon: Icon, external }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                target={external ? "_blank" : undefined}
                                rel={external ? "noopener noreferrer" : undefined}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-on-surface transition hover:bg-surface-container hover:text-primary"
                            >
                                {Icon && <Icon size={20} />}

                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}