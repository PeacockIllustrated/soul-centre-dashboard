import { createClient } from "@/lib/supabase/server";
import { EventTemplateForm } from "../../template-form";
import { notFound } from "next/navigation";

export default async function EditEventTemplatePage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = createClient();
    const { data: template } = await supabase
        .from("event_templates")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!template) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Edit Event Template</h1>
                <p className="text-sm text-gray-500">
                    Update event template details.
                </p>
            </div>
            <EventTemplateForm template={template} />
        </div>
    );
}
