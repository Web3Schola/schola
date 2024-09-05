"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicPlayTrivia = dynamic(() => import("./PlayTrivia"), {
  ssr: false,
});

export default function PlayTriviaPage() {
  return <DynamicPlayTrivia />;
}
