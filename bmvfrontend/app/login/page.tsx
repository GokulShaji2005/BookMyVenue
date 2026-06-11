import React, { Suspense } from "react";
import Login from "@/src/auth/Login";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center font-sans text-sm text-neutral-muted">
        Loading...
      </div>
    }>
      <Login />
    </Suspense>
  );
}
