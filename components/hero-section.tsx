import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Compare } from "@/components/hero/compare";

export const HeroSection = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between max-w-7xl mx-auto px-10 py-4 md:py-12 relative z-10 gap-6 mt-10">
            <div className="mt-0 md:mt-10 flex-1">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-primary mb-6 drop-shadow-md max-w-[12ch] leading-[1.1]">
                    Create Text Behind Image
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground/80 mb-8 max-w-[40ch] leading-relaxed">
                    Transform your designs with stunning text-behind-image effects. Simple, fast, and professional results in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto" asChild
                        data-umami-event="Open App Click"
                        data-umami-event-type="navigation"
                        data-umami-event-location="home_hero"
                    >
                        <Link href="/app">
                            Start Now
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
                    className="w-full h-[350px] md:w-[500px] md:h-[400px]"
                    slideMode="hover"
                />
            </div>
        </div>
    );
};
