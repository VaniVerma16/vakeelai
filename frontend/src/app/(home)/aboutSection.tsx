"use client";

import { LineShadowText } from "../../components/magicui/line-shadow-text";
import { useTheme } from "next-themes";
import { AboutGrid } from "./aboutGrid";

export function AboutSection() {
  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";
  return (
    <>
      <h1 className="text-balance text-5xl text-center my-10 md:my-20 font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-7xl">
      Vakeel.ai: Contracts, But{" "}
        <LineShadowText className="italic" shadowColor={shadowColor}>
          Smarter
        </LineShadowText>
        .
      </h1>
      <AboutGrid />
    </>
  );
}
