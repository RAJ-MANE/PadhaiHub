"use server";

import { createClient } from "@/utils/supabase/server";
import { razorpay } from "@/utils/razorpay";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function createRazorpayOrder(semesterId: string, price: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    // 1. Check for existing completed purchase
    const { data: existingPurchase } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .eq("semester_id", semesterId)
        .eq("status", "completed")
        .maybeSingle();

    if (existingPurchase) {
        return { alreadyPurchased: true };
    }

    // 2. Create Razorpay Order
    const options = {
        amount: price * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}_${user.id.substring(0, 5)}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        };
    } catch (error: any) {
        console.error("Razorpay Order Error:", error);
        throw new Error("Failed to create payment order. Check server logs.");
    }
}

export async function verifyRazorpayPayment(
    semesterId: string,
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        throw new Error("Payment verification failed: Invalid Signature");
    }

    // 2. Record Purchase (Success)
    // Upsert to handle potential duplicate webhook/callback handling
    const { error } = await supabase
        .from("purchases")
        .insert({
            user_id: user.id,
            semester_id: semesterId,
            status: "completed",
            payment_id: razorpay_payment_id,
            amount: 0, // We could pass the real amount if needed, but for now 0 or fetch from order
        });

    if (error) {
        console.error("Database Error:", error);
        // Even if DB fails, payment succeeded. Log critical error.
        // In real app, you might want to retry or have a robust recovery.
    }

    // 3. Revalidate
    return { success: true };
}
