"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function EventsNav() {
    const pathname = usePathname();

    const tabs = [
        { name: "Upcoming Events", href: "/app/events", active: pathname === "/app/events" },
        { name: "Templates", href: "/app/events/templates", active: pathname.startsWith("/app/events/templates") },
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={cn(
                            tab.active
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                        )}
                    >
                        {tab.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
