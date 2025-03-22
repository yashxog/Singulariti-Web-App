import { Metadata } from "next";
import {NewAnswerPageWrapper} from "@/components/newAnswerPageWrapper";

export const metadata: Metadata = {
  title: "Singulariti-Playground",
  description: "Make the process of finding and comparing information easier.",
}

export default function Home() {
  return (
      <div>
        <NewAnswerPageWrapper/>
      </div>
  );
}
