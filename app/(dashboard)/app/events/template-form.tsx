"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEventTemplate, updateEventTemplate } from "./actions";
import Link from "next/link";

interface EventTemplateFormProps {
    template?: {
        id: string;
        name: string;
        default_description: string | null;
        default_duration_minutes: number | null;
        default_price: number | null;
        default_capacity: number | null;
        default_location: string | null;
        is_active: boolean;
    };
}

export function EventTemplateForm({ template }: EventTemplateFormProps) {
    const isEditing = !!template;

    const handleSubmit = async (formData: FormData) => {
        if (isEditing) {
            await updateEventTemplate(template!.id, formData);
        } else {
            await createEventTemplate(formData);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none">
                        Template Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        defaultValue={template?.name}
                        required
                        placeholder="e.g. Soul Sunday"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="default_description" className="text-sm font-medium leading-none">
                        Default Description
                    </label>
                    <textarea
                        id="default_description"
                        name="default_description"
                        defaultValue={template?.default_description || ""}
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="default_duration_minutes" className="text-sm font-medium leading-none">
                            Default Duration (mins)
                        </label>
                        <Input
                            id="default_duration_minutes"
                            name="default_duration_minutes"
                            type="number"
                            defaultValue={template?.default_duration_minutes || 60}
                            required
                            min="0"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="default_price" className="text-sm font-medium leading-none">
                            Default Price (£)
                        </label>
                        <Input
                            id="default_price"
                            name="default_price"
                            type="number"
                            defaultValue={template?.default_price || 0}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="default_capacity" className="text-sm font-medium leading-none">
                            Default Capacity
                        </label>
                        <Input
                            id="default_capacity"
                            name="default_capacity"
                            type="number"
                            defaultValue={template?.default_capacity || 10}
                            required
                            min="1"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="default_location" className="text-sm font-medium leading-none">
                            Default Location
                        </label>
                        <Input
                            id="default_location"
                            name="default_location"
                            defaultValue={template?.default_location || "The Soul Centre"}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        defaultChecked={template?.is_active ?? true}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium leading-none">
                        Active
                    </label>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit">
                    {isEditing ? "Save Changes" : "Create Template"}
                </Button>
                <Link href="/app/events/templates">
                    <Button variant="outline" type="button">
                        Cancel
                    </Button>
                </Link>
            </div>
        </form>
    );
}
