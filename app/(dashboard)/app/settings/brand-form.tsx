"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBrandSettings } from "./actions";
import { useState } from "react";

interface BrandSettingsFormProps {
    settings?: {
        company_name: string | null;
        website_url: string | null;
        support_email: string | null;
        primary_color: string | null;
    } | null;
}

export function BrandSettingsForm({ settings }: BrandSettingsFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true);
        try {
            await updateBrandSettings(formData);
            alert("Settings saved successfully!");
        } catch (error) {
            alert("Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="company_name" className="text-sm font-medium leading-none">
                        Company Name
                    </label>
                    <Input
                        id="company_name"
                        name="company_name"
                        defaultValue={settings?.company_name || "The Soul Centre"}
                        placeholder="e.g. The Soul Centre"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="website_url" className="text-sm font-medium leading-none">
                        Website URL
                    </label>
                    <Input
                        id="website_url"
                        name="website_url"
                        defaultValue={settings?.website_url || ""}
                        placeholder="https://..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="support_email" className="text-sm font-medium leading-none">
                        Support Email
                    </label>
                    <Input
                        id="support_email"
                        name="support_email"
                        type="email"
                        defaultValue={settings?.support_email || ""}
                        placeholder="kayleigh@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="primary_color" className="text-sm font-medium leading-none">
                        Primary Color (Hex)
                    </label>
                    <div className="flex gap-2">
                        <Input
                            id="primary_color"
                            name="primary_color"
                            defaultValue={settings?.primary_color || "#6366f1"}
                            placeholder="#6366f1"
                            className="w-32"
                        />
                        <div
                            className="w-10 h-10 rounded border"
                            style={{ backgroundColor: settings?.primary_color || "#6366f1" }}
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}
