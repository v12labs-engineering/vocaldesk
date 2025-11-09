import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ReactNode } from "react"

export default function Wizard({ steps }: { steps: { title: string, content: ReactNode }[] }) {
    return (
        <Accordion type="single" collapsible className="mx-auto w-3/5">
            {steps.map((step, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{step.title}</AccordionTrigger>
                    <AccordionContent>{step.content}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
