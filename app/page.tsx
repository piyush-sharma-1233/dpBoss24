import React from "react";
import LiveResult from "@/components/Organisms/LiveResult/LiveResult";

export default function Live() {
  return (
    <div className="flex flex-col gap-4 w-full font-[family-name:var(--font-geist-sans)] min-h-screen">
      <LiveResult />
    </div>
  );
}
