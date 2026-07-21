"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowUpRight,
    AudioLines,
    BookOpen,
    Sparkles,
    ShieldCheck,
    Zap,
    Heart,
} from "lucide-react";

import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";
import { Span } from "../typography/Span";
import { FaGithub } from "react-icons/fa";

const productLinks = [
    {
        title: "Documentation",
        href: "/",
        icon: BookOpen,
    },
    {
        title: "Generator",
        href: "/bulk-audio/generator",
        icon: AudioLines,
    },
];

const featureLinks = [
    "Bulk Voice Generation",
    "ElevenLabs Integration",
    "ZIP Download",
    "Secure Local API Key",
];

const resources = [
    "Fast Generation",
    "Multiple Scripts",
    "High Quality Audio",
    "Responsive Dashboard",
];

export const Footer = () => {
    return (
        <footer className="relative overflow-hidden border-t border-outline-variant bg-surface">
            {/* Background */}

            <div className="absolute inset-0 -z-10">

                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/5 blur-[120px]" />

                <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-secondary/5 blur-[150px]" />

            </div>

            <div className="mx-auto max-w-7xl px-6 py-16">

                <div className="grid gap-12 lg:grid-cols-4">

                    {/* Brand */}

                    <div className="space-y-5">

                        <Link
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            <Image
                                src="/wave.svg"
                                alt="Bulk Audio Generator"
                                width={48}
                                height={48}
                            />

                            <Heading
                                as="h3"
                                size="lg"
                                weight="bold"
                            >
                                Bulk Audio
                                <br />
                                Generator
                            </Heading>
                        </Link>

                        <Paragraph className="leading-7 text-on-surface-variant ">
                            Generate hundreds of AI voices simultaneously using
                            your own ElevenLabs API key and download everything
                            as a ZIP archive.
                        </Paragraph>

                        <div className="flex items-center gap-3">

                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-outline-variant bg-surface-container transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
                            >
                                <FaGithub size={18} />
                            </a>

                        </div>

                    </div>

                    {/* Product */}

                    <div>

                        <Heading
                            as="h4"
                            size="md"
                            weight="bold"
                            className="mb-6"
                        >
                            Product
                        </Heading>

                        <div className="space-y-4">

                            {productLinks.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="group flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-surface-container"
                                    >
                                        <div className="flex items-center gap-3">

                                            <Icon
                                                size={18}
                                                className="text-primary"
                                            />

                                            <Span>{item.title}</Span>

                                        </div>

                                        <ArrowUpRight
                                            size={16}
                                            className="opacity-0 transition group-hover:opacity-100"
                                        />

                                    </Link>
                                );
                            })}

                        </div>

                    </div>

                    {/* Features */}

                    <div>

                        <Heading
                            as="h4"
                            size="md"
                            weight="bold"
                            className="mb-6"
                        >
                            Features
                        </Heading>

                        <div className="space-y-4">

                            {featureLinks.map((item) => (

                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >
                                    <Sparkles
                                        size={16}
                                        className="text-primary"
                                    />

                                    <Span>{item}</Span>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* Why Choose */}

                    <div>

                        <Heading
                            as="h4"
                            size="md"
                            weight="bold"
                            className="mb-6"
                        >
                            Why Choose Us
                        </Heading>

                        <div className="space-y-4">

                            {resources.map((item) => (

                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >

                                    {item.includes("Fast") ? (
                                        <Zap
                                            size={16}
                                            className="text-primary"
                                        />
                                    ) : (
                                        <ShieldCheck
                                            size={16}
                                            className="text-primary"
                                        />
                                    )}

                                    <Span>{item}</Span>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

                {/* Bottom */}

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-8 md:flex-row">

                    <Paragraph
                        size="sm"
                        className="text-on-surface-variant"
                    >
                        © {new Date().getFullYear()}{" "}
                        <Span weight="semibold">
                            Bulk Audio Generator
                        </Span>
                        . All rights reserved.
                    </Paragraph>

                    <div className="flex items-center gap-2">

                        <Paragraph
                            size="sm"
                            className="text-on-surface-variant"
                        >
                            Built with
                        </Paragraph>

                        <Heart
                            size={16}
                            className="fill-red-500 text-red-500"
                        />

                        <Paragraph
                            size="sm"
                            className="text-on-surface-variant"
                        >
                            using Next.js, Tailwind CSS & ElevenLabs
                        </Paragraph>

                    </div>

                </div>

            </div>
        </footer>
    );
};