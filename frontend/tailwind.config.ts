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
                    deep: "#FFFFFF", // App Background -> Pure White
                    panel: "#F3F4F6", // Sidebar/Panel -> Light Gray
                    card: "#FFFFFF", // Cards -> White
                    cardHover: "#F9FAFB", // Card Hover -> Very Light Gray
                    border: "#E5E7EB", // Borders -> Light Gray
                    text: {
                        primary: "#111827", // Headings -> Dark Slate (Almost Black)
                        secondary: "#374151", // Body -> Dark Gray
                        muted: "#6B7280", // Muted -> Medium Gray
                        light: "#F9FAFB", // Light text (for inverted contexts)
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
