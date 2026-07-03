import {
  ChazenContentSection,
  ChazenCtaBand,
  ChazenMediaPlaceholder,
  ChazenSubpageHero
} from "@/components/ChazenSubpage";
import { FiveCupsTabs } from "@/app/five-cups/FiveCupsTabs";

export const metadata = {
  title: "五盞建盞 · Five Bowls of Practice",
  description:
    "An interactive Chazen page connecting five Jian Zhan cups with faith, diligence, mindfulness, stillness, and wisdom as tea practice."
};

export default function FiveCupsPage() {
  return (
    <main className="chazen-subpage five-cups-page">
      <ChazenSubpageHero
        eyebrow="Five Cups"
        title="五盞建盞 · Five Bowls of Practice"
        english="Five Jian Zhan Cups, Five Ways Back to the Self"
        copy="一盞茶，不只是入口的味道。它是一個讓人慢下來、觀察自己、重新整理內心的過程。"
        placeholder={{
          asset: "five-cups-overview.webp",
          label: "Future visual: five Jian Zhan cups arranged on a quiet tea table",
          note: "Reserved Five Cups overview visual"
        }}
      />

      <ChazenContentSection
        title="從願意停下來，到看清真正需要"
        english="A tea ritual for self-understanding"
        tone="ivory"
      >
        <div className="five-cups-intro-card">
          <p lang="zh-Hant">
            Chazen 以五盞建盞，對應佛教五根：信、精進、念、定、慧。
            從願意停下來，到持續修習；從覺察念頭，到安住身心；最後，在一杯茶中看清自己真正需要的是什麼。
          </p>
        </div>
      </ChazenContentSection>

      <FiveCupsTabs />

      <ChazenContentSection
        eyebrow="Practice path"
        title="五盞建盞，不是五件收藏品"
        english="A path from noise toward clarity"
        tone="ivory"
      >
        <div className="five-cups-summary">
          <div>
            <p lang="zh-Hant">它們是一條由混亂走向清明的路。</p>
            <p lang="zh-Hant">
              從信開始，願意停下來。以精進建立日常。以念看見當下。以定安住身心。以慧照見真正需要。
            </p>
            <p lang="zh-Hant">這，就是 Chazen 的茶禪之路。</p>
          </div>
          <ChazenMediaPlaceholder
            asset="five-cups-practice-loop.mp4"
            label="Future video: the Five Cups practice loop"
            type="video"
            note="Reserved slow tea ritual motion asset"
          />
        </div>
      </ChazenContentSection>

      <ChazenCtaBand
        title="由此刻開始"
        copy="Let the cup you are drawn to become the next quiet step."
        primary={{ href: "/tea-test", label: "Start Tea Test" }}
        secondary={{ href: "/tea-ritual", label: "Enter Tea Ritual" }}
        next={{ href: "/tea-culture", label: "Tea Culture" }}
      />
    </main>
  );
}
