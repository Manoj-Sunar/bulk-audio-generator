"use client";

import { Background } from "@/app/components/ui/Background";

import { DocumentationHero } from "./DocumentationHero";
import { InstallationGuide } from "./InstalationGuide";
import { ApiWorkflowSection } from "./ApiWorkFlow";
import { ProjectStructureSection } from "./ProjectStructureSection";
import { FAQSection } from "./FAQ";
import { SupportSection } from "./SupportSection";
import { EnvironmentSection } from "./EnvironmentSection";
import { ElevenLabsSetup } from "./ElevenLabsSetup";
import { InstallationSection } from "./InstallationSetup";


export const Documentation = () => {
    return (
        <main className="relative overflow-hidden bg-background">

            <Background />

            <div className="relative z-10">

                <DocumentationHero />

                <InstallationGuide />

                <InstallationSection/>

                <ApiWorkflowSection />

                <ElevenLabsSetup />

                <EnvironmentSection />

                <ProjectStructureSection />

                <FAQSection />

                <SupportSection />



            </div>

        </main>
    );
};