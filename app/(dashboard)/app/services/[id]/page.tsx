import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "../service-form";
import { notFound } from "next/navigation";

export default async function EditServicePage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = createClient();
    const { data: service } = await supabase
        .from("services")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!service) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Edit Service</h1>
                <p className="text-sm text-gray-500">
                    Update service details.
                </p>
            </div>
            <ServiceForm service={service} />
        </div>
    );
}
