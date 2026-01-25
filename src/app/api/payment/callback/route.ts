import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get("payment_id");
    const paymentStatus = searchParams.get("payment_status");
    const purchaseId = searchParams.get("purchase_id");

    const supabase = await createClient();

    if (paymentStatus === "Credit" && purchaseId && paymentId) {
        // Success
        await supabase
            .from("purchases")
            .update({ status: "completed", payment_id: paymentId })
            .eq("id", purchaseId);

        return NextResponse.redirect(new URL("/dashboard?status=success", request.url));
    } else {
        // Failed
        if (purchaseId) {
            await supabase
                .from("purchases")
                .update({ status: "failed" })
                .eq("id", purchaseId);
        }
        return NextResponse.redirect(new URL("/dashboard?status=failed", request.url));
    }
}
