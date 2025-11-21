"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEventInstance, updateEventInstance } from "./actions";
import Link from "next/link";
import { useState, useEffect } from "react";

interface EventFormProps {
    event?: any;
    templates: any[];
}

export function EventForm({ event, templates }: EventFormProps) {
    const isEditing = !!event;

    const [selectedTemplateId, setSelectedTemplateId] = useState(event?.event_template_id || "");
    const [title, setTitle] = useState(event?.title || "");
    const [description, setDescription] = useState(event?.description || "");
    const [price, setPrice] = useState(event?.price || "");
    const [capacity, setCapacity] = useState(event?.capacity || "");
    const [location, setLocation] = useState(event?.location || "");

    // Handle template selection to pre-fill defaults
    useEffect(() => {
        if (selectedTemplateId && !isEditing) {
            const template = templates.find(t => t.id === selectedTemplateId);
            if (template) {
                if (!title) setTitle(template.name);
                if (!description) setDescription(template.default_description || "");
                if (!price) setPrice(template.default_price || "");
                if (!capacity) setCapacity(template.default_capacity || "");
                if (!location) setLocation(template.default_location || "");
            }
        }
    }, [selectedTemplateId, templates, isEditing, title, description, price, capacity, location]);

    const handleSubmit = async (formData: FormData) => {
        // Ensure dates are ISO strings
        const start = new Date(formData.get("start_time") as string);
        const end = new Date(formData.get("end_time") as string);

        formData.set("start_time", start.toISOString());
        formData.set("end_time", end.toISOString());

        if (isEditing) {
            await updateEventInstance(event!.id, formData);
        } else {
            await createEventInstance(formData);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                {!isEditing && (
                    <div className="space-y-2">
                        <label htmlFor="event_template_id" className="text-sm font-medium leading-none">
                            Template (Optional base)
                        </label>
                        <select
                            id="event_template_id"
                            name="event_template_id"
                            value={selectedTemplateId}
                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Select a template...</option>
                            {templates.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium leading-none">
                        Event Title
                    </label>
                    <Input
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Soul Sunday - Winter Solstice"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium leading-none">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="start_time" className="text-sm font-medium leading-none">
                            Start Time
                        </label>
                        <Input
                            id="start_time"
                            name="start_time"
                            type="datetime-local"
                            defaultValue={event?.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : ""}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="end_time" className="text-sm font-medium leading-none">
                            End Time
                        </label>
                        <Input
                            id="end_time"
                            name="end_time"
                            type="datetime-local"
                            defaultValue={event?.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : ""}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium leading-none">
                            Price (£)
                        </label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="capacity" className="text-sm font-medium leading-none">
                            Capacity
                        </label>
                        <Input
                            id="capacity"
                            name="capacity"
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                            min="1"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium leading-none">
                        Location
                    </label>
                    <Input
                        id="location"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. The Soul Centre"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium leading-none">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={event?.status || "scheduled"}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit">
                    {isEditing ? "Save Changes" : "Schedule Event"}
                </Button>
                <Link href="/app/events">
                    <Button variant="outline" type="button">
                        Cancel
                    </Button>
                </Link>
            </div>
        </form>
    );
}
