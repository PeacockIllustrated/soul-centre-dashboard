import { createClient } from "@/lib/supabase/server";
import { SessionForm } from "../session-form";

export default async function NewSessionPage({
    searchParams,
}: {
    searchParams: { client_id?: string };
}) {
    const supabase = createClient();

    // Fetch clients and services for the dropdowns
    const [clientsResult, servicesResult] = await Promise.all([
        supabase.from("clients").select("id, first_name, last_name").eq("is_active", true).order("last_name"),
        supabase.from("services").select("*").eq("is_active", true).order("name"),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">New Session</h1>
                <p className="text-sm text-gray-500">
                    Book a new 1:1 session.
                </p>
            </div>
            <SessionForm
                clients={clientsResult.data || []}
                services={servicesResult.data || []}
                preselectedClientId={searchParams.client_id}
            />
        </div>
    );
}
