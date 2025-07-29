"use client";

import Link from "next/link";
import { Twitter } from "@/components/icons/social-icons";

export default function Footer() {
    return (
        <footer>
            <div className="mt-16 flex flex-col items-center">
                {/* <div className="mb-3 flex space-x-4">
                    <Twitter href="https://twitter.com/textbehindimage" />
                </div> */}

                <div className="mb-6 flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <Link href="/app" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        App
                    </Link>
                    <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        Blog
                    </Link>
                    <Link href="/pricing" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        Pricing
                    </Link>
                </div>

                <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div>{`© ${new Date().getFullYear()}`}</div>
                    <div>{` • `}</div>
                    <Link href="/">Text Behind Image</Link>
                </div>

                <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 items-center">
                    <span>More Tools</span>
                    <Link
                        href="https://wrlmfy.com/?utm_source=textbehindimage.site"
                        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Teleprompter
                    </Link>
                    <Link
                        href="https://tiny-pics.vercel.app/?utm_source=textbehindimage.site"
                        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Tiny Pictures
                    </Link>
                    <Link
                        href="https://aescaneado.site/?utm_source=textbehindimage.site"
                        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Look Scanned
                    </Link>
                </div>
            </div>
        </footer>
    );
}
