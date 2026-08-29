import type { Metadata } from "next";
import HomeExperience from "@/components/home/HomeExperience";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeExperience />;
}
