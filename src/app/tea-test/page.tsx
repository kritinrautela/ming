import { TeaAssessmentExperience } from "@/components/TeaAssessmentExperience";

export const metadata = {
  title: "Chazen Tea State Reflection"
};

export default function TeaTestPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return <TeaAssessmentExperience basePath={basePath} />;
}
