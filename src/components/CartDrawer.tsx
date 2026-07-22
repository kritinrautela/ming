"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/language";
import { startCheckout } from "@/lib/checkout";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { t } = useLanguage();
  const { items, isOpen, closeCart, removeItem, setQuantity } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);

  async function handleCheckout() {
    setIsCheckingOut(true);
    setCheckoutError(false);

    try {
      const url = await startCheckout(items);
      window.location.assign(url);
    } catch {
      setCheckoutError(true);
      setIsCheckingOut(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles["cart-overlay"]} role="presentation" onClick={closeCart}>
      <aside
        className={styles["cart-drawer"]}
        role="dialog"
        aria-modal="true"
        aria-label={t("Shopping cart", "購物車")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles["cart-header"]}>
          <h2>{t("Your Cart", "購物車")}</h2>
          <button type="button" onClick={closeCart} aria-label={t("Close cart", "關閉購物車")}>
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <p className={styles["cart-empty"]}>{t("Your cart is empty.", "購物車是空的。")}</p>
        ) : (
          <>
            <ul className={styles["cart-items"]}>
              {items.map((item) => (
                <li key={item.productId} className={styles["cart-item"]}>
                  <div className={styles["cart-item-info"]}>
                    <strong>{item.name}</strong>
                    <span>{item.priceLabel}</span>
                  </div>
                  <div className={styles["cart-item-controls"]}>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      aria-label={t("Decrease quantity", "減少數量")}
                    >
                      &minus;
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      aria-label={t("Increase quantity", "增加數量")}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className={styles["cart-item-remove"]}
                      onClick={() => removeItem(item.productId)}
                    >
                      {t("Remove", "移除")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {checkoutError ? (
              <p className={styles["cart-checkout-error"]} role="alert">
                {t("Checkout is temporarily unavailable. Please try again.", "結帳服務暫時無法使用，請稍後再試。")}
              </p>
            ) : null}

            <button
              type="button"
              className={styles["cart-checkout-button"]}
              onClick={handleCheckout}
              disabled={isCheckingOut}
              aria-busy={isCheckingOut}
            >
              {isCheckingOut ? t("Opening secure checkout…", "正在開啟安全結帳…") : t("Checkout", "結帳")}
            </button>
          </>
        )}
      </aside>
    </div>
  );
}
