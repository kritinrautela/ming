import { TeaCollectionExperience } from "@/components/TeaCollectionExperience";

export const metadata = {
  title: "Tea Collection"
};

export default function TeaCollectionPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return <TeaCollectionExperience basePath={basePath} />;
}
