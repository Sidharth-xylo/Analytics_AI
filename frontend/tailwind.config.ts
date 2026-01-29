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
                    // PREMIUM COLOR PALETTE
                    deep: "#F8FAFC", // App Background -> Very Light
                    panel: "rgba(255, 255, 255, 0.8)", // Panels -> Strong Glass
                    card: "rgba(255, 255, 255, 0.95)", // Cards -> Nearly Solid
                    cardHover: "rgba(255, 255, 255, 1)", // Card Hover -> Full White
                    border: "rgba(226, 232, 240, 0.6)", // Borders -> Subtle

                    // DARK MODE COLORS
                    darkBg: "#0B1120", // Deep Navy
                    darkCard: "#1A2332", // Dark Slate
                    darkBorder: "rgba(255, 255, 255, 0.1)",

                    // PRIMARY (Vibrant Blue - Trustworthy & Tech)
                    primary: "#0066FF",
                    primaryLight: "#3388FF",
                    primaryDark: "#0052CC",

                    // SECONDARY (Purple - AI/Innovation)
                    secondary: "#7C3AED",
                    secondaryLight: "#9F67FF",
                    secondarySoft: "#A78BFA",

                    // ACCENT (Teal - Energy)
                    deepTeal: "#14B8A6",
                    teal: "#0EA5E9",

                    // NEON ACCENTS
                    electric: "#00F0FF", // Cyan glow
                    neon: "#FF006E", // Hot pink
                    magenta: "#FF2E97", // Bright magenta
                    pink: "#FF6BD9", // Vibrant pink
                    glow: "#7B2FFF", // Purple glow
                    violet: "#B026FF", // Electric violet

                    // SUCCESS/ERROR
                    success: "#10B981",
                    error: "#EF4444",
                    warning: "#F59E0B",

                    // TEXT
                    text: {
                        primary: "#0F172A", // Slate-900
                        secondary: "#475569", // Slate-600
                        muted: "#94A3B8", // Slate-400
                        light: "#FFFFFF",
                    },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                'gradient-primary': 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                'gradient-ai': 'linear-gradient(135deg, #0066FF 0%, #B026FF 50%, #FF2E97 100%)',
                'gradient-warm': 'linear-gradient(135deg, #0EA5E9 0%, #14B8A6 100%)',
                'gradient-dark': 'linear-gradient(135deg, #0B1120 0%, #1A2332 100%)',
                'gradient-hero': 'linear-gradient(135deg, #0B1120 0%, #1e1b4b 40%, #4c1d95 70%, #831843 100%)',
                'gradient-neon': 'linear-gradient(135deg, #FF2E97 0%, #B026FF 50%, #7B2FFF 100%)',
            },
            boxShadow: {
                'premium': '0 4px 24px rgba(0, 102, 255, 0.12)',
                'premium-lg': '0 8px 40px rgba(0, 102, 255, 0.16)',
                'card': '0 2px 12px rgba(15, 23, 42, 0.08)',
                'card-hover': '0 8px 32px rgba(15, 23, 42, 0.12)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
export default config;
