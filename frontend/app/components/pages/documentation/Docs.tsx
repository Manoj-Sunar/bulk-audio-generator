import { DocsHeroSection } from "./HeroSection"
import { HowToUse } from "./Step"

export const Docs = () => {

    return (
        <div className="flex flex-col gap-20">
            <DocsHeroSection />
            <HowToUse/> 
        </div>
    )
}