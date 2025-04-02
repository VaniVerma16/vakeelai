"use client";
import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "../../components/ui/tracing-beams";

export function FeatureSection() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 ml-2 relative">
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-10">
            <h2 className="bg-black dark:bg-white text-white dark:text-black rounded-full text-sm w-fit px-4 py-1 mb-4">
              {item.badge}
            </h2>

            <p className={twMerge("text-xl font-bold mb-4")}>{item.title}</p>

            <div className="text-md prose prose-sm dark:prose-invert">
              {item?.image && (
                <Image
                  src={item.image}
                  alt="blog thumbnail"
                  height="1000"
                  width="1000"
                  className="rounded-lg mb-10 object-cover"
                />
              )}
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
  );
}

const dummyContent = [
  {
    title: "Generate Contracts in Seconds",
    description: (
      <>
        <p>
          Say goodbye to manual drafting! Vakeel.ai generates legally sound
          contracts, NDAs, and agreements in seconds, tailored to your specific
          needs. Our AI ensures each document meets industry standards, reducing
          errors and saving valuable time. Whether you&apos;re a freelancer,
          startup, or enterprise, get contracts that are professional, precise,
          and ready to use. ⚡
        </p>
      </>
    ),
    badge: "Feature",
    image: "/contractgenerator.png",
  },
  {
    title: "Risk Detection",
    description: (
      <>
        <p>
          Avoid legal pitfalls before they happen. Vakeel.ai scans contracts to
          identify vague, unfair, or high-risk clauses that could lead to
          disputes or financial losses. With AI-driven insights, you get
          real-time risk analysis, clause recommendations, and suggested
          modifications to make your agreements stronger and legally sound. Stay
          ahead of potential conflicts with smart contract analysis. 🔍
        </p>
      </>
    ),
    badge: "Feature",
    image: "/riskdetection.png",
  },
  {
    title: "Analyse Contracts",
    description: (
      <>
        <p>
          The legal landscape is constantly evolving—stay compliant with
          real-time regulatory checks. Vakeel.ai analyzes your contracts against
          the latest laws and industry regulations, automatically detecting weak
          or outdated clauses. Our AI rewrites these sections to ensure
          fairness, clarity, and enforceability, so your contracts always meet
          legal standards. Never worry about compliance gaps again! ✅
        </p>
      </>
    ),
    badge: "Feature",
    image: "/compliancechecker.png",
  },
];
