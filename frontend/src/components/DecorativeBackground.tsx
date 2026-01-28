"use client";

import { motion } from "framer-motion";

export default function DecorativeBackground() {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {/* Full-Screen Wavy Line Chart Background */}
            <div className="absolute inset-0 w-full h-full opacity-30">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1920 1080">
                    <defs>
                        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4F6BFF" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#4F6BFF" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#7C6EFF" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#7C6EFF" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Multiple wavy lines creating a chart-like pattern */}
                    {/* Wave 1 - Cyan */}
                    <path
                        d="M0,400 Q240,320 480,380 T960,360 Q1200,340 1440,400 T1920,420"
                        fill="none"
                        stroke="#22D3EE"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.6"
                    >
                        <animate
                            attributeName="d"
                            dur="20s"
                            repeatCount="indefinite"
                            values="
                                M0,400 Q240,320 480,380 T960,360 Q1200,340 1440,400 T1920,420;
                                M0,380 Q240,340 480,360 T960,380 Q1200,320 1440,380 T1920,400;
                                M0,400 Q240,320 480,380 T960,360 Q1200,340 1440,400 T1920,420
                            "
                        />
                    </path>
                    <path
                        d="M0,400 Q240,320 480,380 T960,360 Q1200,340 1440,400 T1920,420 V1080 H0 Z"
                        fill="url(#waveGradient1)"
                    >
                        <animate
                            attributeName="d"
                            dur="20s"
                            repeatCount="indefinite"
                            values="
                                M0,400 Q240,320 480,380 T960,360 Q1200,340 1440,400 T1920,420 V1080 H0 Z;
                                M0,380 Q240,340 480,360 T960,380 Q1200,320 1440,380 T1920,400 V1080 H0 Z;
                                M0,400 Q240,320 480,380 T960,360 Q1200,340 1440,400 T1920,420 V1080 H0 Z
                            "
                        />
                    </path>

                    {/* Wave 2 - Blue */}
                    <path
                        d="M0,500 Q320,420 640,480 T1280,460 Q1520,440 1760,500 T1920,520"
                        fill="none"
                        stroke="#4F6BFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.5"
                    >
                        <animate
                            attributeName="d"
                            dur="25s"
                            repeatCount="indefinite"
                            values="
                                M0,500 Q320,420 640,480 T1280,460 Q1520,440 1760,500 T1920,520;
                                M0,480 Q320,440 640,460 T1280,480 Q1520,420 1760,480 T1920,500;
                                M0,500 Q320,420 640,480 T1280,460 Q1520,440 1760,500 T1920,520
                            "
                        />
                    </path>
                    <path
                        d="M0,500 Q320,420 640,480 T1280,460 Q1520,440 1760,500 T1920,520 V1080 H0 Z"
                        fill="url(#waveGradient2)"
                    >
                        <animate
                            attributeName="d"
                            dur="25s"
                            repeatCount="indefinite"
                            values="
                                M0,500 Q320,420 640,480 T1280,460 Q1520,440 1760,500 T1920,520 V1080 H0 Z;
                                M0,480 Q320,440 640,460 T1280,480 Q1520,420 1760,480 T1920,500 V1080 H0 Z;
                                M0,500 Q320,420 640,480 T1280,460 Q1520,440 1760,500 T1920,520 V1080 H0 Z
                            "
                        />
                    </path>

                    {/* Wave 3 - Purple */}
                    <path
                        d="M0,600 Q400,520 800,580 T1600,560 Q1760,540 1920,600"
                        fill="none"
                        stroke="#7C6EFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.4"
                    >
                        <animate
                            attributeName="d"
                            dur="30s"
                            repeatCount="indefinite"
                            values="
                                M0,600 Q400,520 800,580 T1600,560 Q1760,540 1920,600;
                                M0,580 Q400,540 800,560 T1600,580 Q1760,520 1920,580;
                                M0,600 Q400,520 800,580 T1600,560 Q1760,540 1920,600
                            "
                        />
                    </path>
                    <path
                        d="M0,600 Q400,520 800,580 T1600,560 Q1760,540 1920,600 V1080 H0 Z"
                        fill="url(#waveGradient3)"
                    >
                        <animate
                            attributeName="d"
                            dur="30s"
                            repeatCount="indefinite"
                            values="
                                M0,600 Q400,520 800,580 T1600,560 Q1760,540 1920,600 V1080 H0 Z;
                                M0,580 Q400,540 800,560 T1600,580 Q1760,520 1920,580 V1080 H0 Z;
                                M0,600 Q400,520 800,580 T1600,560 Q1760,540 1920,600 V1080 H0 Z
                            "
                        />
                    </path>
                </svg>
            </div>

            {/* Abstract Gradient Blobs - Cosmic Theme */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
            <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-brand-chart-purple/10 rounded-full blur-[80px]" />

            {/* Floating Chart Card - Top Right (3D Bar Chart) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.3, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-[15%] right-[-2%] w-64 h-48 hidden xl:block"
                style={{ perspective: '1000px' }}
            >
                <div className="relative w-full h-full" style={{
                    transform: 'rotateY(-15deg) rotateX(10deg)',
                    transformStyle: 'preserve-3d'
                }}>
                    <div className="absolute inset-0 bg-brand-card/40 backdrop-blur-md border border-brand-border/40 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-4">
                        <div className="h-full w-full flex items-end justify-between gap-2 pb-2 relative" style={{ transform: 'translateZ(20px)' }}>
                            {[40, 70, 50, 90, 60, 80].map((height, i) => (
                                <div key={i} className="relative w-full" style={{ transform: 'translateZ(10px)' }}>
                                    {/* 3D Bar with depth */}
                                    <div className="relative w-full rounded-t-md"
                                        style={{
                                            height: `${height}%`,
                                            background: `linear-gradient(135deg, ${i % 2 === 0 ? '#4F6BFF' : '#22D3EE'}dd 0%, ${i % 2 === 0 ? '#4F6BFF' : '#22D3EE'}66 100%)`,
                                            boxShadow: `
                                                0 4px 20px rgba(${i % 2 === 0 ? '79,107,255' : '34,211,238'}, 0.4),
                                                inset -2px -2px 8px rgba(0,0,0,0.3),
                                                inset 2px 2px 8px rgba(255,255,255,0.1)
                                            `,
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            transform: 'translateZ(5px)'
                                        }}
                                    >
                                        {/* Side face for depth */}
                                        <div className="absolute right-[-4px] top-0 bottom-0 w-1"
                                            style={{
                                                background: `linear-gradient(180deg, ${i % 2 === 0 ? '#3852CC' : '#1AA3BB'}dd, ${i % 2 === 0 ? '#3852CC' : '#1AA3BB'}33)`,
                                                transform: 'rotateY(90deg) translateZ(3px)',
                                                transformOrigin: 'right'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Shadow layer */}
                    <div className="absolute inset-0 bg-black/20 rounded-2xl blur-xl" style={{ transform: 'translateZ(-20px) scale(0.95)' }} />
                </div>
            </motion.div>


            {/* Floating Chart Card - Bottom Right (Network/Scatter) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.2, scale: 1, y: [0, -10, 0] }}
                transition={{
                    opacity: { duration: 1, delay: 0.9 },
                    scale: { duration: 1, delay: 0.9 },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-[20%] right-[5%] w-48 h-48 bg-brand-card/50 backdrop-blur-md border border-brand-border rounded-full shadow-2xl flex items-center justify-center hidden xl:flex"
            >
                <div className="relative w-full h-full p-4">
                    {/* Abstract Bubbles/Scatter */}
                    <div className="absolute top-[20%] left-[30%] w-8 h-8 rounded-full bg-brand-chart-purple/80 blur-[1px] shadow-[0_0_15px_rgba(167,139,250,0.5)]" />
                    <div className="absolute top-[50%] left-[20%] w-12 h-12 rounded-full bg-brand-chart-blue/80 blur-[1px] shadow-[0_0_15px_rgba(79,107,255,0.5)]" />
                    <div className="absolute bottom-[30%] right-[30%] w-10 h-10 rounded-full bg-brand-chart-green/80 blur-[1px] shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                    <div className="absolute top-[30%] right-[20%] w-6 h-6 rounded-full bg-brand-chart-cyan/80 blur-[1px] shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                    {/* Connecting lines - lighter for dark mode */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                        <line x1="36%" y1="28%" x2="28%" y2="56%" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1="28%" y1="56%" x2="65%" y2="65%" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1="65%" y1="65%" x2="75%" y2="35%" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                </div>
            </motion.div>

            {/* Floating Chart Card - Bottom Left (3D Donut Chart - Purple Accent) */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.3, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute bottom-[10%] left-[2%] w-72 h-48 hidden xl:block"
                style={{ perspective: '1200px' }}
            >
                <div className="relative w-full h-full" style={{
                    transform: 'rotateY(15deg) rotateX(-5deg)',
                    transformStyle: 'preserve-3d'
                }}>
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-5">
                        <div className="relative h-full w-full flex items-center justify-center" style={{ transform: 'translateZ(30px)' }}>
                            {/* 3D Donut Ring */}
                            <div className="relative">
                                {/* Outer ring with gradient - Darker for visibility */}
                                <div className="w-28 h-28 rounded-full relative"
                                    style={{
                                        background: 'conic-gradient(from 0deg, #4338ca 0deg 200deg, #3b82f6 200deg 280deg, #e2e8f0 280deg 360deg)',
                                        boxShadow: `
                                            0 10px 30px rgba(67, 56, 202, 0.3),
                                            inset 0 2px 10px rgba(0,0,0,0.1)
                                        `,
                                        transform: 'translateZ(15px)'
                                    }}
                                >
                                    {/* Inner cutout */}
                                    <div className="absolute inset-[18px] rounded-full bg-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Shadow layer */}
                    <div className="absolute inset-0 bg-black/10 rounded-2xl blur-xl" style={{ transform: 'translateZ(-30px) scale(0.9)' }} />
                </div>
            </motion.div>

            {/* Floating Icons/Elements */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] left-[15%] w-4 h-4 rounded-full bg-brand-chart-cyan/50 filter blur-[1px] shadow-[0_0_10px_#22D3EE]"
            />
            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[30%] right-[20%] w-6 h-6 rounded-full bg-brand-primary/30 filter blur-[2px] shadow-[0_0_10px_#4F6BFF]"
            />
        </div>
    );
}
