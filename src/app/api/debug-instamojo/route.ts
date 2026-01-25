import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.INSTAMOJO_API_KEY;
    const authToken = process.env.INSTAMOJO_AUTH_TOKEN;
    const baseUrl = process.env.INSTAMOJO_URL;

    const maskedKey = apiKey ? `${apiKey.substring(0, 4)}...` : "MISSING";
    const maskedToken = authToken ? `${authToken.substring(0, 4)}...` : "MISSING";

    console.log("--- DEBUG START ---");
    console.log("API Key:", maskedKey, "Length:", apiKey?.length);
    console.log("Auth Token:", maskedToken, "Length:", authToken?.length);
    console.log("Base URL:", baseUrl);

    // Clean the URL (remove quotes if any)
    const cleanBaseUrl = baseUrl?.replace(/['"]/g, '').trim();
    const url = `${cleanBaseUrl}payment-requests/`;

    console.log("Target URL:", url);

    const payload = {
        amount: "10",
        purpose: "Test Connectivity",
        buyer_name: "Tester",
        email: "test@example.com",
        redirect_url: "http://localhost:3000/",
        allow_repeated_payments: "False"
    };

    const formData = new URLSearchParams(payload);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "X-Api-Key": apiKey?.replace(/['"]/g, '').trim() || "",
                "X-Auth-Token": authToken?.replace(/['"]/g, '').trim() || "",
            },
            body: formData,
        });

        const text = await response.text();
        console.log("Response Status:", response.status);
        console.log("Response Text:", text);

        return NextResponse.json({
            status: "Completed Fetch",
            httpStatus: response.status,
            instamojoResponse: text,
            envCheck: {
                key: maskedKey,
                token: maskedToken,
                urlUsed: url
            }
        });

    } catch (error: any) {
        console.error("Fetch Error:", error);
        return NextResponse.json({
            status: "Fetch Failed",
            errorName: error.name,
            errorMessage: error.message,
            errorCause: error.cause,
            envCheck: {
                key: maskedKey,
                token: maskedToken,
                urlUsed: url
            }
        }, { status: 500 });
    }
}
