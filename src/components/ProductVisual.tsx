import Image from "next/image";

export function ProductVisual() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="product-stage shadow-soft" aria-label="Chazen tea ritual gift box visual">
      <Image
        src={`${basePath}/images/chazen-gift-box-packaging-real.png`}
        alt="The real Chazen gift box: gold-foil packaging with crane, bamboo, and blossom motifs on black, jade, and ivory sleeves."
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover"
        priority
      />
    </div>
  );
}
