'use client'

import Link from "next/link"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const STRINGS = {
    brand: "TextBehindImage",
    profile: "Profile",
    subscriptionStatus: "Subscription Status",
    subscribed: "Subscribed",
    upgradePro: "Upgrade to Pro",
    login: "Login"
}

export default function NavBarClient({ user, products, subscription }) {
    return (
        <nav className="flex items-center justify-between px-10 py-4 border-b bg-white dark:bg-zinc-900 transition-all duration-300">
            <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
                {STRINGS.brand}
            </Link>

            <div className="flex flex-row items-center gap-4">
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1">
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{STRINGS.profile}</span>
                                <ChevronDown className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                {user && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/account" className="text-sm">
                                                {user.email}
                                            </Link>
                                        </DropdownMenuItem>
                                        {subscription && (
                                            <DropdownMenuItem className="text-sm">
                                                {STRINGS.subscriptionStatus}: {subscription.status}
                                            </DropdownMenuItem>
                                        )}
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {user ? (
                    subscription ? (
                        <Button className="bg-green-600 text-white rounded-full hover:bg-green-700">
                            {STRINGS.subscribed}
                        </Button>
                    ) : (
                        <Link href="/pricing">
                            <Button className="bg-[#2A2B2A] text-white rounded-full hover:bg-[#2A2B2A]/90">
                                {STRINGS.upgradePro}
                            </Button>
                        </Link>
                    )
                ) : (
                    <Link href="/login">
                        <Button className="bg-[#2A2B2A] text-white rounded-full hover:bg-[#2A2B2A]/90">
                            {STRINGS.login}
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}