import { EventTemplateForm } from "../../template-form";

export default function NewEventTemplatePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">New Event Template</h1>
                <p className="text-sm text-gray-500">
                    Create a template for recurring group events.
                </p>
            </div>
            <EventTemplateForm />
        </div>
    );
}
