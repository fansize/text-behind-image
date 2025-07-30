import Link from "next/link"
import { Button } from "@/components/ui/button"
import PromoBanner from "./promp-banner"

export default function Nav() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            {/* <PromoBanner /> */}
            <nav className="flex items-center justify-between px-10 md:px-10 py-4 border-b bg-white/80 backdrop-blur-md transition-all duration-300">
                <Link href="/" className="text-xl font-bold">
                    TextBehindImage
                </Link>

                <Link href="/app">
                    <Button className="tracking-wider bg-black text-white rounded-full hover:bg-[#2A2B2A]/90">
                        Start Free
                    </Button>
                </Link>
            </nav>
        </div>
    )
}