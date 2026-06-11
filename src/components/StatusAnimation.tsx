"use client";

import React from "react";
import Lottie from "lottie-react";
// Imports the JSON directly from your public folder
import mountRunData from "../../public/transparent_mount_run.json";

export default function StatusAnimation() {
  return (
    <div className="w-24 h-24 mt-0 opacity-80 mix-blend-screen">
      <Lottie animationData={mountRunData} loop={true} />
    </div>
  );
}