"use client";

import { useState, useEffect } from "react";

export interface SavedBuild {
  id: string;
  name: string;
  profession: string;
  skills: string[]; // Mapped to 8 selected skill slots
  traits: number[]; // Array tracking chosen major trait node IDs
  updatedAt: string;
}

export function useBuildStorage() {
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);

  // Safely mount and hydrate state from localStorage inside Next.js Client Architecture
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("gw3_frontier_builds");
      if (cached) {
        try {
          setSavedBuilds(JSON.parse(cached));
        } catch (e) {
          console.error("Signal corruption in local build cache allocation:", e);
        }
      }
    }
  }, []);

  const saveBuild = (newBuild: Omit<SavedBuild, "id" | "updatedAt"> & { id?: string }) => {
    const buildToSave: SavedBuild = {
      id: newBuild.id || crypto.randomUUID(),
      name: newBuild.name || "UNNAMED_TACTICAL_PROFILE",
      profession: newBuild.profession,
      skills: newBuild.skills,
      traits: newBuild.traits,
      updatedAt: new Date().toISOString(),
    };

    const updated = [...savedBuilds.filter((b) => b.id !== buildToSave.id), buildToSave];
    setSavedBuilds(updated);
    localStorage.setItem("gw3_frontier_builds", JSON.stringify(updated));
  };

  const deleteBuild = (id: string) => {
    const updated = savedBuilds.filter((b) => b.id !== id);
    setSavedBuilds(updated);
    localStorage.setItem("gw3_frontier_builds", JSON.stringify(updated));
  };

  return { savedBuilds, saveBuild, deleteBuild };
}