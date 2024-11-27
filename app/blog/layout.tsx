import { Metadata } from 'next';
import NavBar from "@/components/nav";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://textbehindimage.site'),
    title: "Blog | Text Behind Image",
    description: "Explore articles about image editing, design tips, and updates about our text overlay tool.",
    openGraph: {
        title: "Blog | Text Behind Image",
        description: "Explore articles about image editing, design tips, and updates about our text overlay tool.",
        type: "website",
        url: "https://textbehindimage.site/blog",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | Text Behind Image",
        description: "Explore articles about image editing, design tips, and updates about our text overlay tool.",
    },
    alternates: {
        canonical: 'https://textbehindimage.site/blog',
    },
};

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <NavBar />
            {children}
        </div>
    )
}
