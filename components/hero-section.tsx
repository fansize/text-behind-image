import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Compare } from "@/components/hero/compare";

export const HeroSection = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between px-10 pt-20 pb-4 md:pt-20 md:pb-12 relative z-10 gap-6 mt-10">
            <div className="mt-0 md:mt-10 flex-1">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-primary mb-6 drop-shadow-md max-w-[12ch] leading-[1.1]">
                    Create Text Behind Image
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-[40ch] leading-relaxed">
                    Create stunning text-behind-image effects in seconds. No design skills needed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90" asChild
                        data-umami-event="Click Start Button"
                        data-umami-event-type="navigation"
                        data-umami-event-location="home_hero"
                    >
                        <Link
                            href="/app"
                            title="Start using our free online tool"
                            aria-label="Start creating text behind image effects with our online editor"
                        >
                            Create Now →
                        </Link>
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto" asChild
                        data-umami-event="Click Get Inspired Button"
                        data-umami-event-type="navigation"
                        data-umami-event-location="home_hero"
                    >
                        <Link
                            href="/blog"
                            title="Get inspired by our blog"
                            aria-label="Get inspired by our blog"
                        >
                            Get Inspired
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <Compare
                    firstImage="/hero/after.png"
                    secondImage="/hero/before.png"
                    firstImageClassName="object-cover object-left-top"
                    secondImageClassname="object-cover object-left-top"
                    className="w-full h-[230px] md:w-[600px] md:h-[400px]"
                    slideMode="hover"
                />
            </div>
        </div>
    );
};
