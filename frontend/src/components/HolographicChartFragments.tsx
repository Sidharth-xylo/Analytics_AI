"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Fragment {
    id: number;
    type: 'bar' | 'pie' | 'line' | 'axis';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    color: string;
}

interface HolographicChartFragmentsProps {
    isActive: boolean;
    chartType?: 'bar' | 'line' | 'pie' | 'scatter';
    onMessageSent?: boolean;
    onResponseReceived?: boolean;
}

const COLORS = ['#0047AB', '#000080', '#82C8E5', '#6D8196'];

// Generate fragments based on chart type
// Now producing varied sizes and ensuring they are ready for lower-half positioning
const generateFragments = (type: string, count: number): Fragment[] => {
    const fragments: Fragment[] = [];
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    for (let i = 0; i < count; i++) {
        // Randomize size heavily
        const scale = 0.5 + Math.random() * 1.5;

        fragments.push({
            id: i,
            type: type as any,
            // Initial random positions (will settle to lower half)
            x: Math.random() * windowWidth - windowWidth / 2,
            y: Math.random() * windowHeight - windowHeight / 2,
            width: (40 + Math.random() * 60) * scale,
            height: (40 + Math.random() * 100) * scale,
            rotation: Math.random() * 360,
            color: COLORS[i % COLORS.length]
        });
    }
    return fragments;
};

export default function HolographicChartFragments({
    isActive,
    chartType = 'bar',
    onMessageSent,
    onResponseReceived
}: HolographicChartFragmentsProps) {
    const [fragments, setFragments] = useState<Fragment[]>([]);
    const [isAssembled, setIsAssembled] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);

    // Initialize fragments on mount
    useEffect(() => {
        if (isActive) {
            setFragments(generateFragments(chartType, 35));
            // Trigger assembly after short delay
            setTimeout(() => setIsAssembled(true), 100);
        }
    }, [isActive, chartType]);

    // Handle message sent - disassemble and reassemble
    useEffect(() => {
        if (onMessageSent && isAssembled) {
            setIsAssembled(false);
            setTimeout(() => {
                setFragments(generateFragments(
                    ['bar', 'line', 'pie'][Math.floor(Math.random() * 3)],
                    35
                ));
                setTimeout(() => setIsAssembled(true), 300);
            }, 800);
        }
    }, [onMessageSent]);

    // Handle response - pulse effect
    useEffect(() => {
        if (onResponseReceived) {
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 600);
        }
    }, [onResponseReceived]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <AnimatePresence>
                {fragments.map((fragment, index) => {
                    // Start in random spot
                    // Assembled Position: SPREAD ACROSS LOWER HALF
                    // X: Random across width (-45vw to 45vw approximate)
                    // Y: Lower half (0 to 300px down from center)
                    const assembledPosition = {
                        x: (Math.random() * 80 - 40) + "vw", // Use VW for responsiveness
                        y: (Math.random() * 40 + 10) + "vh"  // Use VH, keeping it in lower half
                    };

                    return (
                        <motion.div
                            key={fragment.id}
                            initial={{
                                x: fragment.x,
                                y: fragment.y,
                                rotate: fragment.rotation,
                                opacity: 0
                            }}
                            animate={{
                                x: isAssembled ? assembledPosition.x : fragment.x,
                                y: isAssembled
                                    ? [
                                        assembledPosition.y,
                                        (parseFloat(assembledPosition.y) - (2 + Math.random() * 5)) + "vh",
                                        assembledPosition.y
                                    ]
                                    : fragment.y,
                                rotate: isAssembled ? fragment.rotation + (Math.random() * 20 - 10) : fragment.rotation,
                                opacity: isAssembled ? 0.3 : 0,
                                scale: isPulsing ? [1, 1.1, 1] : 1
                            }}
                            exit={{
                                x: fragment.x * 1.5,
                                y: fragment.y * 1.5,
                                rotate: fragment.rotation + 360,
                                opacity: 0
                            }}
                            transition={{
                                duration: isAssembled ? 3 + Math.random() * 2 : 0.8,
                                repeat: isAssembled ? Infinity : 0,
                                repeatType: "reverse",
                                ease: "easeInOut",
                                delay: isAssembled ? index * 0.02 : 0
                            }}
                            className="absolute top-1/2 left-1/2"
                            style={{
                                width: fragment.width,
                                height: fragment.height,
                            }}
                        >
                            {/* Fragment shape based on type */}
                            {fragment.type === 'bar' && (
                                <div
                                    className="w-full h-full rounded-t-lg"
                                    style={{
                                        background: `linear-gradient(180deg, ${fragment.color}40 0%, ${fragment.color}10 100%)`,
                                        border: `2px solid ${fragment.color}`,
                                        boxShadow: `0 0 20px ${fragment.color}60, inset 0 0 10px ${fragment.color}40`,
                                        filter: 'blur(0.5px)'
                                    }}
                                />
                            )}
                            {fragment.type === 'pie' && (
                                <svg width={fragment.width} height={fragment.height} viewBox="0 0 120 120">
                                    <defs>
                                        <filter id={`glow-${fragment.id}`}>
                                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    <path
                                        d="M60,60 L60,10 A50,50 0 0,1 95,85 Z"
                                        fill={`${fragment.color}20`}
                                        stroke={fragment.color}
                                        strokeWidth="2"
                                        filter={`url(#glow-${fragment.id})`}
                                    />
                                </svg>
                            )}
                            {fragment.type === 'line' && (
                                <div
                                    className="w-full h-full rounded-full"
                                    style={{
                                        background: `radial-gradient(circle, ${fragment.color}80 0%, ${fragment.color}20 100%)`,
                                        border: `2px solid ${fragment.color}`,
                                        boxShadow: `0 0 15px ${fragment.color}90`
                                    }}
                                />
                            )}
                            {fragment.type === 'axis' && (
                                <div
                                    className="w-full h-full"
                                    style={{
                                        background: `linear-gradient(90deg, transparent 0%, ${fragment.color}60 20%, ${fragment.color}60 80%, transparent 100%)`,
                                        boxShadow: `0 0 10px ${fragment.color}70`
                                    }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
