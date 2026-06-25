// src/app/(public)/build-crafter/page.tsx
"use client";

import { useEra } from "@/context/EraContext";
import Gw1Builds from "@/components/builds/Gw1Builds";
import Gw2Builds from "@/components/builds/Gw2Builds";
import Gw3Builds from "@/components/builds/Gw3Builds";

export default function BuildCrafterPage() {
  const { activeEra } = useEra();

  // The Traffic Cop: Render a completely different component based on the era
  return (
    <div className="w-full">
      {activeEra === "gw1" && <Gw1Builds />}
      {activeEra === "gw2" && <Gw2Builds />}
      {activeEra === "gw3" && <Gw3Builds />}
    </div>
  );
}