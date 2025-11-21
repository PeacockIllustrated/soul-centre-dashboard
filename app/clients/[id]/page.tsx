import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, FileText } from "lucide-react";

export default async function ClientDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = createClient();
    const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!client) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/app/clients">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {client.first_name} {client.last_name}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        {client.email && (
                            <div className="flex items-center">
                                <Mail className="mr-1.5 h-3.5 w-3.5" />
                                {client.email}
                            </div>
                        )}
                        {client.phone && (
                            <div className="flex items-center">
                                <Phone className="mr-1.5 h-3.5 w-3.5" />
                                {client.phone}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline">Edit Profile</Button>
                    <Button>New Session</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content - Tabs Placeholder */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button className="border-indigo-500 text-indigo-600 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                Overview
                            </button>
                            <button className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                Sessions
                            </button>
                            <button className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                                Notes
                            </button>
                        </nav>
                    </div>

                    {/* Overview Tab Content */}
                    <div className="space-y-6">
                        <div className="bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">
                                    Client Details
                                </h3>
                                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Source</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{client.source || "-"}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Preferred Contact</dt>
                                        <dd className="mt-1 text-sm text-gray-900 capitalize">{client.preferred_contact_method || "-"}</dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Notes</dt>
                                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{client.notes || "-"}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                Quick Stats
                            </h3>
                            <dl className="mt-5 grid grid-cols-1 gap-5">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Total Sessions</dt>
                                    <dd className="mt-1 text-2xl font-semibold text-gray-900">0</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Last Visit</dt>
                                    <dd className="mt-1 text-sm text-gray-900">-</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
