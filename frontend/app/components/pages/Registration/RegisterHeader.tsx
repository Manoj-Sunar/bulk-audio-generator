"use client";

import { UserPlus } from "lucide-react";

import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import Image from "next/image";

export const RegisterHeader = () => {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center">
       <Image src="/wave.svg" alt="logo" width={100} height={100}/>
      </div>

      <div className="space-y-2">
        <Heading
          as="h1"
          size="2xl"
          weight="extrabold"
          className="text-center"
        >
          Create your account
        </Heading>

        <Paragraph
          size="lg"
          className="mx-auto max-w-md text-on-surface-variant text-center"
        >
          Join Bulk Audio Generator and start generating hundreds
          of AI voice files with your ElevenLabs API key.
        </Paragraph>
      </div>
    </div>
  );
};