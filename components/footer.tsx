"use client";

import Link from "next/link";
import { Twitter } from "@/components/social-icons";

export default function Footer() {
    return (
        <footer>
            <div className="mt-16 flex flex-col items-center">
                {/* <div className="mb-3 flex space-x-4">
                    <Twitter href="https://twitter.com/textbehindimage" />
                </div> */}

                <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div>{`© ${new Date().getFullYear()}`}</div>
                    <div>{` • `}</div>
                    <Link href="/">Text Behind Image</Link>
                </div>

                <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 items-center">
                    <span>Partners:</span>
                    <Link
                        href="https://gpt4oo.com/?utm_source=textbehindimage.site"
                        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GPT4oo
                    </Link>
                    <Link
                        href="https://www.logoai.com/?utm_source=textbehindimage.site"
                        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        AI Logo Maker
                    </Link>
                </div>
            </div>
        </footer>
    );
}
