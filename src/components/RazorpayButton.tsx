"use client";

import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/browse/actions";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Script from "next/script";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function RazorpayButton({ semesterId, price, title }: { semesterId: string, price: number, title: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            // 1. Create Order
            const data = await createRazorpayOrder(semesterId, price);

            if (data.alreadyPurchased) {
                router.push("/dashboard");
                return;
            }

            // 2. Open Razorpay Modal
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "PadhaiHub",
                description: `Purchase ${title}`,
                order_id: data.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        await verifyRazorpayPayment(
                            semesterId,
                            response.razorpay_payment_id,
                            response.razorpay_order_id,
                            response.razorpay_signature
                        );
                        alert("Payment Successful!");
                        router.push("/dashboard?status=success");
                        router.refresh();
                    } catch (verifyError: any) {
                        alert("Payment verification failed: " + verifyError.message);
                    }
                },
                theme: {
                    color: "#7C3AED", // Violet
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (error: any) {
            console.error("Payment Start Error:", error);
            alert("Could not update payment: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <Button
                size="lg"
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full text-lg h-12 font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
                {isLoading ? "Processing..." : "Buy Now"}
            </Button>
        </>
    );
}
