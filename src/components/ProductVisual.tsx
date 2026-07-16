import Image from "next/image";

export function ProductVisual() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="product-stage shadow-soft" aria-label="Chazen tea ritual gift box visual">
      <Image
        src={`${basePath}/images/chazen-gift-box-v1.jpg`}
        alt="The Chazen Tea Ritual Gift Box, opened to show loose-leaf tea, compact teaware, and ritual cards."
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover"
        priority
      />
    </div>
  );
}
