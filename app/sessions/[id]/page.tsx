import { createClient } from "@/lib/supabase/server";
import { SessionForm } from "../session-form";
import { notFound } from "next/navigation";

export default async function EditSessionPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = createClient();

    const [sessionResult, clientsResult, servicesResult] = await Promise.all([
        supabase.from("sessions").select("*").eq("id", params.id).single(),
        supabase.from("clients").select("id, first_name, last_name").order("last_name"),
        supabase.from("services").select("*").order("name"),
    ]);

    if (!sessionResult.data) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Edit Session</h1>
                <p className="text-sm text-gray-500">
                    Update session details.
                </p>
            </div>
            <SessionForm
                session={sessionResult.data}
                clients={clientsResult.data || []}
                services={servicesResult.data || []}
            />
        </div>
    );
}
