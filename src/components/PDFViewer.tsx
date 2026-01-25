"use client";

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker via Unpkg to avoid bundling issues
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    url: string;
}

export default function PDFViewer({ url }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Responsive width handler
    useEffect(() => {
        if (!containerRef.current) return;

        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        // Initial set
        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center h-full w-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 pointer-events-auto"
            onContextMenu={(e) => e.preventDefault()}
        >
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="text-white animate-pulse">Loading document...</div>}
                error={<div className="text-red-500">Failed to load document. URL might be invalid or inaccessible.</div>}
                className="max-w-full"
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <div key={`page_${index + 1}`} className="mb-6 shadow-2xl bg-white">
                        {containerWidth > 0 && (
                            <Page
                                pageNumber={index + 1}
                                width={Math.min(containerWidth - 32, 1200)} // Max width constraint for readability
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                error={<div className="text-red-500 text-xs p-2">Page error</div>}
                            />
                        )}
                    </div>
                ))}
            </Document>
        </div>
    );
}
