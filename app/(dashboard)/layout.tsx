import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Sparkles,
    Settings,
    LogOut
} from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const signOut = async () => {
        "use server";
        const supabase = createClient();
        await supabase.auth.signOut();
        redirect("/login");
    };

    const navigation = [
        { name: "Dashboard", href: "/app", icon: LayoutDashboard },
        { name: "Clients", href: "/app/clients", icon: Users },
        { name: "Services", href: "/app/services", icon: Sparkles },
        { name: "Events", href: "/app/events", icon: Calendar }, // Using Calendar icon for events for now
        { name: "Sessions", href: "/app/sessions", icon: Calendar },
        { name: "Calendar", href: "/app/calendar", icon: Calendar },
        { name: "Settings", href: "/app/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="hidden w-64 flex-col bg-white border-r border-gray-200 md:flex">
                <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
                    <h1 className="text-lg font-semibold tracking-tight text-gray-900">The Soul Centre</h1>
                </div>
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="mt-5 flex-1 space-y-1 px-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                                <item.icon
                                    className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="border-t border-gray-200 p-4">
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                            <LogOut
                                className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                            />
                            Sign out
                        </button>
                    </form>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
