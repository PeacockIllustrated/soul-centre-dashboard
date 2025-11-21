import { createClient } from "@/lib/supabase/server";
import { EventForm } from "../event-form";

export default async function NewEventPage() {
    const supabase = createClient();
    const { data: templates } = await supabase
        .from("event_templates")
        .select("*")
        .eq("is_active", true)
        .order("name");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Schedule Event</h1>
                <p className="text-sm text-gray-500">
                    Schedule a new group event instance.
                </p>
            </div>
            <EventForm templates={templates || []} />
        </div>
    );
}
