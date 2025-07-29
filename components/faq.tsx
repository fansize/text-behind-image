import { FC } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
    question: string;
    answer: string;
}

const DEFAULT_ITEMS: FAQItem[] = [
    {
        question: "What is the Text Behind Image tool?",
        answer:
            "The Text Behind Image tool is a free online platform that allows you to create professional text overlays on images effortlessly. It's perfect for presentations, social media posts, and graphic design projects.",
    },
    {
        question: "How do I use the Text Behind Image tool?",
        answer:
            "Simply upload your image, enter the text you want to overlay, and customize the style to fit your needs. Our intuitive interface makes it easy to achieve stunning results in seconds.",
    },
    {
        question: "Is the Text Behind Image tool free to use?",
        answer:
            "Yes, the tool is completely free to use. You can create and download as many designs as you like without any cost.",
    },
    {
        question: "Can I use this tool for commercial projects?",
        answer:
            "Absolutely! You can use the Text Behind Image tool for both personal and commercial projects. There are no restrictions on usage.",
    },
    {
        question: "Do I need to create an account to use the tool?",
        answer:
            "No account is required. You can start creating text overlays on images immediately without any sign-up process.",
    },
];

export const FAQ: FC<{ items?: FAQItem[] }> = (props) => {
    const { items = DEFAULT_ITEMS } = props;
    return (

        <div className="w-full px-10 py-2 md:py-6 md:px-8">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl text-center mb-8">
                    FAQ
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                    {items.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="rounded-lg shadow-sm border"
                        >
                            <AccordionTrigger className="px-4 py-4">
                                <span className="text-left font-medium">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 pt-2 text-gray-600">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>

    );
};
