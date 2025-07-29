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
import { SignOut } from "@/utils/auth-helpers/server";

const STRINGS = {
    brand: "TextBehindImage",
    profile: "Profile",
    account: "Account",
    subscriptionStatus: "Manage Subscription",
    subscribed: "Subscribed",
    upgradePro: "Upgrade to Pro",
    login: "Login",
    logout: "Logout"
}

export default function NavBarClient({ user, products, subscription }) {
    return (
        <nav className="flex items-center justify-between px-10 py-4 border-b bg-white dark:bg-zinc-900 transition-all duration-300">
            <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
                {STRINGS.brand}
            </Link>

            <div className="flex flex-row items-center gap-4">
                <div className="hidden md:flex items-center gap-8">
                    {user && (
                        <div className="flex items-center gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{user.email}</span>
                                    <ChevronDown className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    {user && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href="/account" className="text-sm">
                                                    {STRINGS.subscriptionStatus}
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem asChild>
                                                <form action={async (formData) => {
                                                    await SignOut(formData);
                                                }}>
                                                    <input type="hidden" name="pathName" value="/" />
                                                    <button type="submit" className="text-sm text-red-600 w-full text-left">
                                                        {STRINGS.logout}
                                                    </button>
                                                </form>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>

                {user ? (
                    subscription ? (
                        <Button className="bg-orange-600 text-white rounded-full hover:bg-orange-700">
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
                    <Link href="/signin">
                        <Button
                            className="bg-[#2A2B2A] text-white rounded-full hover:bg-[#2A2B2A]/90"
                            data-umami-event="login_button_click"
                            data-umami-event-type="action"
                        >
                            {STRINGS.login}
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}