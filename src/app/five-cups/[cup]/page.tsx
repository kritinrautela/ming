import { permanentRedirect } from "next/navigation";
import { cupKeys } from "@/app/five-cups/fiveCupsData";

type FiveCupPageProps = {
  params: Promise<{
    cup: string;
  }>;
};

export function generateStaticParams() {
  return cupKeys.map((cup) => ({ cup }));
}

export async function generateMetadata({ params }: FiveCupPageProps) {
  await params;

  return {
    title: "Five Cups"
  };
}

export default async function FiveCupPage({ params }: FiveCupPageProps) {
  await params;
  permanentRedirect("/five-cups");
}
