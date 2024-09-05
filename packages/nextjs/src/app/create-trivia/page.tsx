"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicCreateTrivia = dynamic(() => import("./CreateTrivia"), {
  ssr: false,
});

export default function CreateTriviaPage() {
  return <DynamicCreateTrivia />;
}
