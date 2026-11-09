import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container-x py-10 lg:py-14">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <p className="mt-2 max-w-2xl text-ink/75">
        Submit your order request. Online payment is not enabled yet — no card is charged. Our team will contact you to confirm availability, shipping
        and payment.
      </p>
      <CheckoutForm />
    </div>
  );
}
