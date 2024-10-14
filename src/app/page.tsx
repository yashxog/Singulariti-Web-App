import { Suspense } from "react";
import { Metadata } from "next";
import MainPage from "@/components/mainPage";

export const metadata: Metadata = {
  title: "Singulariti-Playground",
  description: "Make the process of finding and comparing information easier.",
}

export default function Home() {
  return (
      <Suspense>
        <MainPage/>
      </Suspense>
  );
}
