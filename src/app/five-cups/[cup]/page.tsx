import { notFound } from "next/navigation";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import { cupKeys, fiveCups, type CupKey } from "@/app/five-cups/fiveCupsData";
import { FiveCupPhilosophy, FiveCupProductBridge } from "@/app/five-cups/[cup]/FiveCupDetail";

type FiveCupPageProps = {
  params: Promise<{
    cup: string;
  }>;
};

function getCup(cup: string) {
  if (!cupKeys.includes(cup as CupKey)) {
    return null;
  }

  return fiveCups.find((item) => item.key === cup) ?? null;
}

export function generateStaticParams() {
  return cupKeys.map((cup) => ({ cup }));
}

export async function generateMetadata({ params }: FiveCupPageProps) {
  const { cup } = await params;
  const currentCup = getCup(cup);

  return {
    title: currentCup ? `${currentCup.english} | Five Cups` : "Five Cups"
  };
}

export default async function FiveCupPage({ params }: FiveCupPageProps) {
  const { cup } = await params;
  const currentCup = getCup(cup);

  if (!currentCup) {
    notFound();
  }

  return (
    <main className="chazen-subpage five-cups-page">
      <ChazenSubpageHero
        eyebrow={`${currentCup.buddhistTerm} / Five Cups`}
        title={`${currentCup.tab}｜${currentCup.coreMeaning}`}
        english={currentCup.english}
        copy={currentCup.teaZenMeaning}
        copyEn={currentCup.teaZenMeaningEn}
        media={{
          asset: currentCup.asset,
          alt: currentCup.visualDirectionEn
        }}
      />

      <ChazenContentSection
        eyebrow="Philosophy"
        eyebrowZh="哲理"
        title="這一盞茶，對應一種當下狀態"
        english="A faculty for this moment"
        tone="paper"
      >
        <FiveCupPhilosophy cup={currentCup} />
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="First product step"
        eyebrowZh="產品第一步"
        title="從 A$25 First Pack 開始"
        english="Bridge the philosophy into a first cup"
      >
        <FiveCupProductBridge cup={currentCup} />
      </ChazenContentSection>

      <ChazenCtaBand
        title="先找到你此刻需要的茶"
        titleEn="First, Find the Tea You Need Right Now"
        copy="Take the Tea Test, then choose the first pack or tea box that fits your current rhythm."
        copyZh="先做茶測試，再選擇符合你此刻節奏的初次體驗包或茶盒。"
        primary={{ href: "/tea-test", label: "Start Tea Test", labelZh: "開始茶測試" }}
        secondary={{ href: "/tea-boxes", label: "Explore Tea Boxes", labelZh: "探索茶盒" }}
        next={{ href: "/five-cups", label: "Back to Five Cups", labelZh: "返回五盞建盞" }}
      />
    </main>
  );
}
