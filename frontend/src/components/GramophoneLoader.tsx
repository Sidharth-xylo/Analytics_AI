"use client";

import { motion } from "framer-motion";

export default function GramophoneLoader() {
    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Spinning Record/Pie Chart */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-glow shadow-premium-lg"
            >
                {/* Grooves */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 rounded-full border-2 border-white/20"
                        style={{
                            transform: `scale(${1 - i * 0.15})`,
                        }}
                    />
                ))}

                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-brand-primary" />
                    </div>
                </div>
            </motion.div>

            {/* Insights Flying Out */}
            {[0, 120, 240].map((angle, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.8],
                        x: [0, Math.cos((angle * Math.PI) / 180) * 60],
                        y: [0, Math.sin((angle * Math.PI) / 180) * 60],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                    }}
                    className="absolute w-3 h-3 bg-brand-electric rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                />
            ))}

            {/* Glow Effect */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-32 h-32 rounded-full bg-brand-glow/30 blur-xl"
            />
        </div>
    );
}
