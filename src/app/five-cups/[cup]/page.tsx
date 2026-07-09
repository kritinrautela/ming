import { notFound } from "next/navigation";
import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenMediaPlaceholder,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import { cupKeys, fiveCups, type CupKey } from "@/app/five-cups/fiveCupsData";

type FiveCupPageProps = {
  params: Promise<{
    cup: string;
  }>;
};

const firstPackContents = ["Curated starter tea", "Tea-Mind result card", "Simple brewing guide"];

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
        placeholder={{
          asset: currentCup.asset,
          label: currentCup.visualDirection,
          note: "Future Jian Zhan cup photography"
        }}
      />

      <ChazenContentSection
        eyebrow="Philosophy"
        title="這一盞茶，對應一種當下狀態"
        english="A faculty for this moment"
        tone="paper"
      >
        <article className="chazen-subpage-note five-cups-detail-note">
          <h3>{currentCup.english}</h3>
          <p lang="zh-Hant">{currentCup.modernState}</p>
          <div lang="zh-Hant">
            {currentCup.mainCopy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </ChazenContentSection>

      <ChazenContentSection
        eyebrow="First product step"
        title="從 A$25 First Pack 開始"
        english="Bridge the philosophy into a first cup"
      >
        <div className="faculty-product-bridge">
          <ChazenMediaPlaceholder
            asset="first-pack-mockup.webp"
            label="Future visual: A$25 First Pack"
            note={`Starter pack connected to ${currentCup.english}`}
          />
          <article className="chazen-subpage-card">
            <span>A$25 First Pack</span>
            <h3>A simple first step after {currentCup.tab}</h3>
            <p>
              This pack turns the {currentCup.english.toLowerCase()} idea into a practical first tea ritual:
              one approachable tea direction, one short guide, and one result card to keep the meaning close.
            </p>
            <ul>
              {firstPackContents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="先找到你此刻需要的茶"
        copy="Take the Tea Test, then choose the first pack or tea box that fits your current rhythm."
        primary={{ href: "/tea-test", label: "Start Tea Test" }}
        secondary={{ href: "/tea-boxes", label: "Explore Tea Boxes" }}
        next={{ href: "/five-cups", label: "Back to Five Cups" }}
      />
    </main>
  );
}
