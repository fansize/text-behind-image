// import { BGShapeCircle } from "@/components/bg-shape-circle";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
    return (
        <div className="relative">
            <div className="max-w-7xl mx-auto px-10 py-4 md:py-12 relative z-10">
                <div className="max-w-5xl">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 drop-shadow-md">
                        Create text-behind-image designs easily
                    </h1>
                    <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
                        Create text-behind-image designs easily with ConvertFast.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto" asChild
                            data-umami-event="Open App Click"
                            data-umami-event-type="navigation"
                            data-umami-event-location="home_hero"
                        >
                            <a href="/app">
                                Start now
                            </a>
                        </Button>
                    </div>

                </div>


            </div>
        </div>
    );
};
