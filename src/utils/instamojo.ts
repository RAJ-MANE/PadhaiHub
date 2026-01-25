export const createPaymentRequest = async (payload: {
    amount: number;
    purpose: string;
    buyer_name: string;
    email: string;
    phone?: string;
    redirect_url: string;
    webhook?: string;
}) => {
    const url = `${process.env.INSTAMOJO_URL}payment-requests/`;

    const formData = new URLSearchParams();
    formData.append("amount", payload.amount.toString());
    formData.append("purpose", payload.purpose);
    formData.append("buyer_name", payload.buyer_name);
    formData.append("email", payload.email);
    formData.append("redirect_url", payload.redirect_url);
    formData.append("allow_repeated_payments", "False");
    if (payload.phone) formData.append("phone", payload.phone);
    if (payload.webhook) formData.append("webhook", payload.webhook);

    console.log("Initiating Instamojo Request...");
    console.log("URL:", url);
    console.log("API Key Present:", !!process.env.INSTAMOJO_API_KEY);
    console.log("Auth Token Present:", !!process.env.INSTAMOJO_AUTH_TOKEN);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "X-Api-Key": process.env.INSTAMOJO_API_KEY!,
                "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN!,
            },
            body: formData,
        });

        const responseText = await response.text();
        console.log("Instamojo Response Status:", response.status);
        console.log("Instamojo Response Body:", responseText);

        if (!response.ok) {
            throw new Error(`Instamojo API Error: ${response.status} ${responseText}`);
        }

        const data = JSON.parse(responseText);
        return data;
    } catch (error) {
        console.error("Instamojo Error:", error);
        throw error;
    }
};
