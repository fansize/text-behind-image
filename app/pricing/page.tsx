import PricingCards from "./_components/pricing-cards";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STRINGS = {
  title: "Choose Your Plan",
  subtitle: "Select a plan that suits your needs. Upgrade or downgrade anytime.",
  billing: {
    monthly: "Monthly",
    yearly: "Yearly"
  }
} as const;

export default function PricingPage() {
  return (
    <section className="container mx-auto">
      <div className="flex flex-col items-center justify-center space-y-8 py-20">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            {STRINGS.title}
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground">
            {STRINGS.subtitle}
          </p>
        </div>

        <Tabs defaultValue="monthly" className="w-full max-w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">{STRINGS.billing.monthly}</TabsTrigger>
            <TabsTrigger value="yearly">{STRINGS.billing.yearly}</TabsTrigger>
          </TabsList>
        </Tabs>

        <PricingCards />
      </div>
    </section>
  );
}