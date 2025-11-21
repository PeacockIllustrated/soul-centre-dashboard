import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

const lato = Lato({
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
    variable: "--font-lato",
});

export const metadata: Metadata = {
    title: "The Soul Centre Admin",
    description: "Admin dashboard for The Soul Centre",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(
                playfair.variable,
                lato.variable,
                "min-h-screen bg-background font-sans antialiased"
            )}>
                {children}
            </body>
        </html>
    );
}
