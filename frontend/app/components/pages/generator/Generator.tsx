"use client";

import { useState } from "react";

import { ApiKeyCard } from "./ApiKeyCard";
import { GeneratorHeader } from "./GeneratorHeader";
import { ScriptEditorCard } from "./ScriptEditor";
import { Background } from "../../ui/Background";

export const Generator = () => {
    const [apiKey, setApiKey] = useState("");
    const [scripts, setScripts] = useState("");

    return (
        <main className="min-h-screen bg-background">

            <Background />

            <GeneratorHeader />

            <section className="mx-auto max-w-7xl px-6 py-5 lg:px-8">

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">

                    {/* Left Sidebar */}

                    <aside className="xl:col-span-5">

                        <ApiKeyCard
                            value={apiKey}
                            onChange={setApiKey}

                        />

                    </aside>

                    {/* Main Content */}

                    <section className="xl:col-span-7">

                        <ScriptEditorCard
                            value={scripts}
                            onChange={setScripts}
                        />

                    </section>

                </div>

            </section>

        </main>
    );
};