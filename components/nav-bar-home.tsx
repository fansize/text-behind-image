import Link from "next/link"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Nav() {
    return (
        <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-10 md:px-10 py-4 border-b bg-white/80 backdrop-blur-md z-50 transition-all duration-300">
            <Link href="/" className="text-xl font-bold">
                TextBehindImage
            </Link>

            {/* <div className="hidden md:flex items-center gap-8">
                <Link href="/community" className="text-sm font-medium">
                    Community
                </Link>
                <div className="flex items-center gap-1">
                    <Link href="/resources" className="text-sm font-medium">
                        Blogs
                    </Link>
                </div>
                <Link href="/pricing" className="text-sm font-medium">
                    Pricing
                </Link>

            </div> */}

            <Link href="/app">
                <Button className="tracking-wider bg-[#2A2B2A] text-white rounded-full hover:bg-[#2A2B2A]/90">
                    Start Free
                </Button>
            </Link>
        </nav>
    )
}