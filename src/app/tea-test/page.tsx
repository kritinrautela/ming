import { TeaAssessmentExperience } from "@/components/TeaAssessmentExperience";

export const metadata = {
  title: "The Five Cups Reflection"
};

export default function TeaTestPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return <TeaAssessmentExperience basePath={basePath} />;
}
