import { STEPS } from "@/app/lib/constants"
import { Heading } from "../../typography/Heading"
import { Paragraph } from "../../typography/Paragraph"
import { Card } from "../../ui/Card"

export const HowToUse = () => {
    return (
        <section className="py-10">
            <div className="container mx-auto max-w-7xl px-6">

                <div className="mx-auto mb-16 max-w-3xl text-center">

                    <Heading
                        as="h2"
                        size="3xl"
                        weight="bold"
                    >
                        Get Started in
                        <span className="text-primary"> 6 Simple Steps</span>
                    </Heading>

                    <Paragraph
                        className="mt-5 text-on-surface-variant"
                    >
                        From creating your ElevenLabs API key to downloading hundreds of generated voices, the entire workflow takes only a few minutes.
                    </Paragraph>

                </div>

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                    {STEPS.map(({ icon: Icon, title, description }, index) => (

                        <Card
                            key={title}
                            className="group relative rounded-3xl border-outline-variant p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl"
                        >

                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-primary">

                                <Icon size={30} />

                            </div>

                            <div className="absolute right-6 top-6 text-5xl font-black text-primary/10">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <Heading
                                as="h3"
                                size="xl"
                                weight="bold"
                            >
                                {title}
                            </Heading>

                            <Paragraph className="mt-4 leading-7 text-on-surface-variant">
                                {description}
                            </Paragraph>

                        </Card>

                    ))}

                </div>

            </div>
        </section>
    )
}