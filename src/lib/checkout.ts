import type { CartItem } from "@/lib/cart";

export const checkoutApiUrl =
  process.env.NEXT_PUBLIC_CHECKOUT_API_URL ?? "https://chazen-website.vercel.app/api/checkout/";

export async function startCheckout(items: CartItem[]) {
  const response = await fetch(checkoutApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
    })
  });
  const result = (await response.json()) as { url?: string };

  if (!response.ok || !result.url) {
    throw new Error("Checkout could not be started");
  }

  return result.url;
}
