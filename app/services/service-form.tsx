"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createService, updateService } from "./actions";
import Link from "next/link";

interface ServiceFormProps {
    service?: {
        id: string;
        name: string;
        category: string | null;
        description: string | null;
        duration_minutes: number;
        base_price: number;
        is_active: boolean;
    };
}

export function ServiceForm({ service }: ServiceFormProps) {
    const isEditing = !!service;

    const handleSubmit = async (formData: FormData) => {
        if (isEditing) {
            await updateService(service!.id, formData);
        } else {
            await createService(formData);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={service?.name}
                            required
                            placeholder="e.g. Reiki Healing"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            defaultValue={service?.category || "energy_healing"}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="energy_healing">Energy Healing</option>
                            <option value="counselling">Counselling</option>
                            <option value="coaching">Coaching</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={service?.description || ""}
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="duration_minutes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Duration (minutes)
                        </label>
                        <Input
                            id="duration_minutes"
                            name="duration_minutes"
                            type="number"
                            defaultValue={service?.duration_minutes}
                            required
                            min="0"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="base_price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Price (£)
                        </label>
                        <Input
                            id="base_price"
                            name="base_price"
                            type="number"
                            defaultValue={service?.base_price}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        defaultChecked={service?.is_active ?? true}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Active (available for booking)
                    </label>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit">
                    {isEditing ? "Save Changes" : "Create Service"}
                </Button>
                <Link href="/app/services">
                    <Button variant="outline" type="button">
                        Cancel
                    </Button>
                </Link>
            </div>
        </form>
    );
}
