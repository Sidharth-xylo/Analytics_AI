"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import DataConnect from "@/components/DataConnect";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, BarChart3, Database } from "lucide-react";
import DecorativeBackground from "@/components/DecorativeBackground";
import HolographicChartFragments from "@/components/HolographicChartFragments";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [fileData, setFileData] = useState<any>(null);
    const [showFragments, setShowFragments] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Protect Route
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleUploadComplete = (data: any) => {
        console.log("File uploaded:", data);
        setFileData(data);

        // Add a small delay for effect
        setTimeout(() => {
            setDataLoaded(true);
            setShowFragments(true);
        }, 500);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        router.push('/login');
    };

    return (
        <main className="min-h-screen bg-brand-deep text-brand-text-primary relative selection:bg-brand-primary/30">

            {/* Background Elements */}
            <DecorativeBackground />

            {/* Holographic Fragment Effects */}
            <HolographicChartFragments
                isActive={showFragments}
                chartType="bar"
            />

            <div className="container mx-auto px-4 py-8 relative z-10 min-h-screen flex flex-col">
                <header className="flex items-center justify-between py-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white border-2 border-purple-500 rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] relative overflow-hidden">
                            <Image src="/mascot.png" alt="Logo" fill className="object-contain p-2" priority />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-5xl font-extrabold tracking-tight leading-none text-black">
                                XYLO<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">4AI</span>
                            </h1>
                            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-chart-cyan mt-1">
                                NEX-GEN
                            </p>
                            <p className="text-sm text-brand-text-muted mt-0 tracking-wide uppercase">
                                Business intelligence
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors"
                    >
                        Logout
                    </button>
                </header>

                {/* content */}
                <div className="flex-1 flex flex-col items-center justify-center relative py-10">
                    <AnimatePresence mode="wait">
                        {!dataLoaded ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                transition={{ duration: 0.5 }}
                                className="w-full max-w-4xl flex flex-col items-center"
                            >
                                <div className="text-center mb-10 space-y-6 flex flex-col items-center">
                                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-text-primary">
                                        Unlock insights from <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-chart-cyan to-brand-secondary">your data</span> instantly.
                                    </h2>
                                    <p className="text-brand-text-muted text-lg max-w-lg mx-auto">
                                        Upload your CSV or Excel files and chat with your data using advanced AI analytics.
                                    </p>
                                </div>

                                <div className="w-full max-w-xl bg-brand-card/50 backdrop-blur-sm p-2 rounded-2xl border border-brand-border shadow-2xl">
                                    <DataConnect onConnect={handleUploadComplete} />
                                </div>

                                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm text-brand-text-muted w-full max-w-3xl">
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="p-3 rounded-full bg-brand-card border border-brand-border group-hover:border-brand-primary/50 group-hover:shadow-[0_0_15px_rgba(79,107,255,0.2)] transition-all duration-300">
                                            <Database className="w-5 h-5 text-brand-text-secondary group-hover:text-brand-primary transition-colors" />
                                        </div>
                                        <span>Secure Data Processing</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="p-3 rounded-full bg-brand-card border border-brand-border group-hover:border-brand-chart-cyan/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300">
                                            <BarChart3 className="w-5 h-5 text-brand-text-secondary group-hover:text-brand-chart-cyan transition-colors" />
                                        </div>
                                        <span>Auto-generated Charts</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="p-3 rounded-full bg-brand-card border border-brand-border group-hover:border-brand-secondary/50 group-hover:shadow-[0_0_15px_rgba(124,110,255,0.2)] transition-all duration-300">
                                            <Sparkles className="w-5 h-5 text-brand-text-secondary group-hover:text-brand-secondary transition-colors" />
                                        </div>
                                        <span>AI-Powered Insights</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="w-full h-full flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-brand-text-muted">Analysis Session</span>
                                        <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs border border-brand-primary/20 font-medium">Active</span>
                                    </div>
                                </div>
                                <ChatInterface isConnected={true} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
