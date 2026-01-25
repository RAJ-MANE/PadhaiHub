# Deployment Guide for PadhaiHub

This application is built with **Next.js 15+** and **Supabase**, making **Vercel** the ideal platform for deployment.

## Prerequisites

1.  **Vercel Account**: [Sign up here](https://vercel.com/signup).
2.  **GitHub Repository**: Push your code to a GitHub repository.

## Step-by-Step Deployment

1.  **Go to Vercel Dashboard**: Click "Add New..." -> "Project".
2.  **Import Repository**: Select your `e-resources` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Build Command**: `npm run build` (default).

4.  **Environment Variables (CRITICAL)**:
    You must add the following variables in the Vercel dashboard under "Environment Variables".

    | Variable Name | Value | Description |
    | :--- | :--- | :--- |
    | `NEXT_PUBLIC_SUPABASE_URL` | `https://dtastdphfgvximdkbxdm.supabase.co` | Your Supabase Project URL |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Your Anon Key)* | Found in Supabase -> Settings -> API |
    | `RAZORPAY_KEY_ID` | *(Your Razorpay Key ID)* | **Required** for payments |
    | `RAZORPAY_KEY_SECRET` | *(Your Razorpay Secret)* | **Required** for payments |
    | `NEXT_PUBLIC_BASE_URL` | `https://your-project.vercel.app` | The URL Vercel assigns you (update after deploy) |

    > **Note**: I noticed `RAZORPAY` keys were missing from your local `.env`. Ensure you have them ready for production!

5.  **Deploy**: Click "Deploy". Vercel will build your app.

## Post-Deployment Checks

1.  **Supabase Auth**: Go to Supabase -> Authentication -> URL Configuration.
    *   Add your new Vercel URL (e.g., `https://padhaihub.vercel.app`) to **Site URL** and **Redirect URLs**.
2.  **Images**: If images fail to load, check that `next.config.ts` has the correct `remotePatterns` (I have already configured this for you).

## Troubleshooting

-   **Build Fails?** Check the "Logs" tab in Vercel.
-   **Images not showing?** Ensure the `images` domain in `next.config.ts` matches your Supabase URL.
-   **Payments failing?** Verify Razorpay keys are correct and in "Production" mode (not Test mode) if going live.
