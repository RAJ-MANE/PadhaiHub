"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./PDFViewer"), {
    ssr: false,
    loading: () => <div className="text-white flex items-center justify-center h-full">Initializing Secure Viewer...</div>
});

export default function PDFViewerLoader({ url }: { url: string }) {
    return <PDFViewer url={url} />;
}
