import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            screens: {
                "hover-hover": { raw: "(hover: hover)" },
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            typography: (theme: any) => ({
                invert: {
                    css: {
                        "--tw-prose-body": theme("colors.gray[300]"),
                        "--tw-prose-headings": theme("colors.gray[100]"),
                        "--tw-prose-lead": theme("colors.gray[300]"),
                        "--tw-prose-links": theme("colors.blue[400]"),
                        "--tw-prose-bold": theme("colors.gray[100]"),
                        "--tw-prose-counters": theme("colors.gray[400]"),
                        "--tw-prose-bullets": theme("colors.gray[400]"),
                        "--tw-prose-hr": theme("colors.gray[700]"),
                        "--tw-prose-quotes": theme("colors.gray[100]"),
                        "--tw-prose-quote-borders": theme("colors.gray[700]"),
                        "--tw-prose-captions": theme("colors.gray[400]"),
                        "--tw-prose-code": theme("colors.gray[100]"),
                        "--tw-prose-pre-code": theme("colors.gray[300]"),
                        "--tw-prose-pre-bg": theme("colors.gray[800]"),
                        "--tw-prose-th-borders": theme("colors.gray[700]"),
                        "--tw-prose-td-borders": theme("colors.gray[700]"),
                    },
                },
            }),
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
