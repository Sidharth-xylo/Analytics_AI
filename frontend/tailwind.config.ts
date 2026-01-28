import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: "#4F6BFF", // Electric Blue (Kept Same)
                    primarySoft: "#5B6CFF",
                    secondary: "#7C6EFF", // Violet/Purple (Kept Same)
                    secondarySoft: "#8B85FF",
                    accent: "#22C55E", // Green (Kept Same)
                    accentSoft: "#4ADE80",
                    deep: "#F8FAFC", // App Background -> Very Light Blue/Gray
                    panel: "rgba(255, 255, 255, 0.7)", // Sidebar/Panel -> Light Glass
                    card: "rgba(255, 255, 255, 0.8)", // Cards -> Stronger Light Glass
                    cardHover: "rgba(255, 255, 255, 0.9)", // Card Hover
                    border: "rgba(226, 232, 240, 0.8)", // Borders -> Light Gray (Slate-200)
                    text: {
                        primary: "#0F172A", // Headings -> Slate-900
                        secondary: "#475569", // Body -> Slate-600
                        muted: "#94A3B8", // Muted -> Slate-400
                        light: "#FFFFFF", // Light text (for buttons/inverted)
                    },
                    chart: {
                        blue: "#4F6BFF",
                        cyan: "#06B6D4",
                        purple: "#8B5CF6",
                        green: "#10B981",
                        red: "#EF4444"
                    }
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
