"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Database, BarChart3, Zap, ChevronDown } from 'lucide-react';
import DecorativeBackground from '@/components/DecorativeBackground';
import HolographicChartFragments from '@/components/HolographicChartFragments';
import ChatInterface from '@/components/ChatInterface';
import DataConnect from '@/components/DataConnect';

export default function HomePage() {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showFragments, setShowFragments] = useState(false);

    const uploadSectionRef = useRef<HTMLDivElement>(null);

    const handleUploadComplete = (data: any) => {
        setDataLoaded(true);
        setShowFragments(true);
        setTimeout(() => setShowFragments(false), 2000);
    };

    const scrollToUpload = () => {
        uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const benefits = [
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Faster Insights",
            description: "Get answers in seconds, not days"
        },
        {
            icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>,
            title: "No Data Analyst Needed",
            description: "AI does the heavy lifting for you"
        },
        {
            icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>,
            title: "Zero Learning Curve",
            description: "Natural language, instant results"
        },
        {
            icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>,
            title: "Just Ask Questions",
            description: "Chat with your data like a colleague"
        }
    ];

    return (
        <main className="min-h-screen bg-brand-deep text-brand-text-primary relative selection:bg-brand-primary/30 overflow-x-hidden">
            {/* Background Elements */}
            <DecorativeBackground />

            {/* Holographic Fragment Effects */}
            <HolographicChartFragments
                isActive={showFragments}
                chartType="bar"
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-ai flex items-center justify-center shadow-premium relative">
                        <Image src="/mascot.png" alt="Logo" fill className="object-contain p-2" priority />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-bold tracking-tight leading-none text-slate-900">
                            XYLO<span className="bg-gradient-ai bg-clip-text text-transparent">4AI</span>
                        </h1>
                        <p className="text-xs font-bold bg-gradient-ai bg-clip-text text-transparent uppercase tracking-wider">
                            AI-Powered Analytics
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="pt-24">
                {!dataLoaded ? (
                    <>
                        {/* HERO SECTION - Dark with High Energy */}
                        <section
                            className="relative bg-gradient-hero min-h-screen flex items-center justify-center overflow-hidden"
                        >
                            {/* Animated Background Elements */}
                            <div className="absolute inset-0">
                                <div className="absolute top-20 left-10 w-72 h-72 bg-brand-magenta/20 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-violet/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                            </div>

                            <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <h2 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6 leading-tight">
                                        Data Insights<br />
                                        <span className="bg-gradient-neon bg-clip-text text-transparent">In Seconds</span>
                                    </h2>
                                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-16">
                                        Transform raw data into actionable insights with AI-powered analytics. No coding. No complexity.
                                    </p>
                                </motion.div>

                                {/* Benefits Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                                            className="group bg-brand-darkCard/50 backdrop-blur-xl border border-brand-darkBorder hover:border-brand-magenta/50 rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105"
                                        >
                                            <div className="text-brand-magenta group-hover:text-brand-pink transition-colors mb-4">
                                                {benefit.icon}
                                            </div>
                                            <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                                            <p className="text-slate-400 text-sm">{benefit.description}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Scroll Indicator */}
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="flex flex-col items-center gap-3 text-white/80 cursor-pointer"
                                >
                                    <span className="text-base font-medium">Scroll to get started</span>
                                    <div className="w-12 h-12 rounded-full bg-gradient-neon/20 border border-brand-pink/40 flex items-center justify-center">
                                        <ChevronDown className="w-6 h-6 text-brand-pink" />
                                    </div>
                                </motion.div>
                            </div>
                        </section>

                        {/* UPLOAD SECTION */}
                        <section
                            ref={uploadSectionRef}
                            className="min-h-screen flex items-center justify-center py-20 px-4 relative z-10 bg-brand-deep"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="w-full max-w-4xl"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-5xl font-bold tracking-tight text-slate-900 mb-4">
                                        Get Started
                                    </h2>
                                    <p className="text-slate-600 text-lg">
                                        Upload your data and start chatting
                                    </p>
                                </div>

                                <DataConnect onConnect={handleUploadComplete} />

                                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm text-slate-600">
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 group-hover:border-blue-500/50 group-hover:shadow-premium transition-all duration-300">
                                            <Database className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span>Secure Data Processing</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 group-hover:border-cyan-500/50 group-hover:shadow-premium transition-all duration-300">
                                            <BarChart3 className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <span>Auto-generated Charts</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-premium transition-all duration-300">
                                            <Zap className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span>Instant Insights</span>
                                    </div>
                                </div>
                            </motion.div>
                        </section>
                    </>
                ) : (
                    // Chat Interface - Fixed Height, No Page Scroll
                    <div className="fixed inset-0 pt-24 pb-8 px-4 md:px-8 flex items-center justify-center">
                        <ChatInterface isConnected={dataLoaded} />
                    </div>
                )}
            </div>
        </main>
    );
}
